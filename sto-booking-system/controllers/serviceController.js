const { Service } = require('../models/associations'); // Імпортуємо модель

// 1. Отримати всі послуги (GET)
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера при отриманні послуг' });
    }
};

// 2. Створити нову послугу (POST)
exports.createService = async (req, res) => {
    try {
        // Отримуємо дані з тіла запиту (req.body)
        const { name, description, price, duration_minutes } = req.body;

        // Валідація: чи всі дані є?
        if (!name || !price || !duration_minutes) {
            return res.status(400).json({ message: 'Назва, ціна та тривалість є обов\'язковими' });
        }

        // Створення запису в БД
        const newService = await Service.create({
            name,
            description,
            price,
            duration_minutes
        });

        res.status(201).json(newService); // 201 = Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при створенні послуги' });
    }
};

// 3. Видалити послугу (DELETE) - корисно для тестів
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ message: 'Послугу не знайдено' });
        }

        await service.destroy();
        res.json({ message: 'Послугу успішно видалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка видалення' });
    }
};

// 4. Оновити послугу (PUT)
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, duration_minutes } = req.body;

        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ message: 'Послугу не знайдено' });
        }

        // Оновлюємо поля
        service.name = name || service.name;
        service.description = description || service.description;
        service.price = price || service.price;
        service.duration_minutes = duration_minutes || service.duration_minutes;

        await service.save();

        res.json({ message: 'Послугу оновлено успішно', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка оновлення послуги' });
    }
};