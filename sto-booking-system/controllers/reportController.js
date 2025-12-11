const { Appointment, Service, Employee } = require('../models/associations');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;

        // Перетворення дат для коректного пошуку (від початку дня до кінця дня)
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(23,59,59,999);

        const dateFilter = {
            start_datetime: {
                [Op.between]: [start, end]
            },
            status: { [Op.in]: ['confirmed', 'completed'] } 
        };

        let data = [];

        if (type === 'services') {
            const appointments = await Appointment.findAll({
                where: dateFilter,
                include: [{ model: Service, attributes: ['name', 'price'] }]
            });

            const stats = {};
            appointments.forEach(app => {
                // !!! ЗАХИСТ ВІД ПОМИЛКИ !!!
                // Якщо послуги немає (видалена), називаємо її "Unknown"
                const name = app.Service ? app.Service.name : 'Видалена послуга';
                
                // Якщо ціна записана в Payment, треба брати звідти, але поки беремо з послуги
                // Додаємо захист, якщо ціни немає
                const price = app.Service ? parseFloat(app.Service.price) : 0; 
                
                if (!stats[name]) stats[name] = { name, count: 0, revenue: 0 };
                stats[name].count += 1;
                stats[name].revenue += price;
            });

            data = Object.values(stats);
        } 
        else if (type === 'masters') {
            const appointments = await Appointment.findAll({
                where: dateFilter,
                include: [
                    { model: Employee, as: 'master', attributes: ['first_name', 'last_name'] },
                    { model: Service, attributes: ['price'] }
                ]
            });

            const stats = {};
            appointments.forEach(app => {
                // !!! ЗАХИСТ ВІД ПОМИЛКИ !!!
                const masterName = app.master ? `${app.master.first_name} ${app.master.last_name}` : 'Невідомий майстер';
                const price = app.Service ? parseFloat(app.Service.price) : 0;

                if (!stats[masterName]) stats[masterName] = { name: masterName, count: 0, revenue: 0 };
                stats[masterName].count += 1;
                stats[masterName].revenue += price;
            });

            data = Object.values(stats);
        }

        res.json(data);

    } catch (error) {
        console.error("REPORT ERROR:", error); // Це покаже точну помилку в консолі
        res.status(500).json({ message: 'Помилка генерації звіту' });
    }
};