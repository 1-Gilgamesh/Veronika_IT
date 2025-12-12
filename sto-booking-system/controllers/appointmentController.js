const { Appointment, Service, Employee, User, MasterSchedule } = require('../models/associations');
const { Op } = require('sequelize'); 

// 1. Створити запис на прийом (З ПЕРЕВІРКАМИ)
exports.createAppointment = async (req, res) => {
    try {
        const { master_id, service_id, start_datetime } = req.body;
        const client_id = req.user.id; 
        
        if (req.user.role === 'admin' && req.body.client_id) {
            client_id = req.body.client_id;
        }

        if (!master_id || !service_id || !start_datetime) {
            return res.status(400).json({ message: 'Всі поля обов\'язкові' });
        }

        // 1. Розраховуємо час початку і кінця запису
        const service = await Service.findByPk(service_id);
        if (!service) return res.status(404).json({ message: 'Послугу не знайдено' });

        const requestedStart = new Date(start_datetime);
        const requestedEnd = new Date(requestedStart.getTime() + service.duration_minutes * 60000);

        // ----------------------------------------------------
        // ПЕРЕВІРКА №1: Чи працює майстер у цей час?
        // ----------------------------------------------------
        
        // Визначаємо день тижня (у JS 0=Неділя, у нас в БД 7=Неділя, 1=Понеділок)
        // Використовуємо локальний час, оскільки datetime-local input відправляє локальний час
        let dayOfWeek = requestedStart.getDay(); 
        if (dayOfWeek === 0) dayOfWeek = 7; 

        const schedule = await MasterSchedule.findOne({
            where: { master_id, day_of_week: dayOfWeek }
        });

        // а) Чи є графік і чи робочий це день?
        if (!schedule || !schedule.is_working) {
            return res.status(400).json({ message: 'Майстер не працює в цей день' });
        }

        // б) Чи впадає час у робочі години?
        // Парсимо час з бази (формат '09:00:00' або '09:00:00.000')
        const startTimeParts = schedule.start_time.split(':');
        const endTimeParts = schedule.end_time.split(':');
        const startHour = parseInt(startTimeParts[0]);
        const startMinute = parseInt(startTimeParts[1]);
        const endHour = parseInt(endTimeParts[0]);
        const endMinute = parseInt(endTimeParts[1]);

        // Створюємо об'єкти Date для початку і кінця зміни у ЦЕЙ КОНКРЕТНИЙ ДЕНЬ
        // Використовуємо локальний час для узгодження з requestedStart
        const shiftStart = new Date(requestedStart);
        shiftStart.setHours(startHour, startMinute, 0, 0);

        const shiftEnd = new Date(requestedStart);
        shiftEnd.setHours(endHour, endMinute, 0, 0);

        // Перевірка: Запис не може початися раніше зміни або закінчитися пізніше
        if (requestedStart < shiftStart || requestedEnd > shiftEnd) {
            return res.status(400).json({ 
                message: `Майстер працює з ${schedule.start_time.slice(0,5)} до ${schedule.end_time.slice(0,5)}` 
            });
        }

        // ----------------------------------------------------
        // ПЕРЕВІРКА №2: Чи не зайнятий цей час іншим записом?
        // ----------------------------------------------------
        
        const existingAppointment = await Appointment.findOne({
            where: {
                master_id,
                status: { [Op.notIn]: ['cancelled', 'no_show'] }, // Ігноруємо скасовані записи
                [Op.or]: [
                    // Логіка перетину інтервалів:
                    // (StartA < EndB) AND (EndA > StartB)
                    {
                        start_datetime: { [Op.lt]: requestedEnd },
                        end_datetime: { [Op.gt]: requestedStart }
                    }
                ]
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Цей час вже зайнятий іншим записом' });
        }

        // ----------------------------------------------------
        // Якщо всі перевірки пройдено - створюємо запис
        // ----------------------------------------------------

        const newAppointment = await Appointment.create({
            client_id,
            master_id,
            service_id,
            start_datetime: requestedStart,
            end_datetime: requestedEnd,
            status: 'pending'
        });

        res.status(201).json({ message: 'Запис успішно створено!', appointment: newAppointment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка створення запису' });
    }
};

// 2. Отримати записи поточного користувача ("Мої записи")
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { client_id: req.user.id }, // Тільки для того, хто питає
            include: [
                { model: Service, attributes: ['name', 'price'] }, // Додати назву послуги
                { model: Employee, as: 'master', attributes: ['first_name', 'last_name'] } // Додати ім'я майстра
            ],
            order: [['start_datetime', 'ASC']] // Сортувати за датою
        });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка отримання записів' });
    }
};

// 3. [ADMIN] Отримати ВСІ записи
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: User, as: 'client', attributes: ['full_name', 'email'] }, // Дані клієнта
                { model: Employee, as: 'master', attributes: ['first_name', 'last_name'] }, // Дані майстра
                { model: Service, attributes: ['name', 'price'] } // Дані послуги
            ],
            order: [['start_datetime', 'DESC']] // Спочатку найсвіжіші
        });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка завантаження записів' });
    }
};

// 4. [ADMIN] Змінити статус запису
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed', 'completed', 'cancelled' тощо

        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Запис не знайдено' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: 'Статус оновлено', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка оновлення статусу' });
    }
};