const { Employee } = require('../models/associations');

// 1. Отримати список усіх майстрів (для вибору на клієнті)
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка отримання списку майстрів' });
    }
};

// 2. Додати нового майстра (тільки для адміна/менеджера)
exports.createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, position, phone } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ message: "Ім'я та прізвище обов'язкові" });
        }

        const newEmployee = await Employee.create({
            first_name,
            last_name,
            position,
            phone
        });

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка додавання майстра' });
    }
};

// 3. Видалити майстра
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        // Sequelize каскадно видалить і графік, і записи цього майстра (через onDelete: CASCADE)
        await Employee.destroy({ where: { id } }); 
        res.json({ message: 'Майстра видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка видалення' });
    }
};