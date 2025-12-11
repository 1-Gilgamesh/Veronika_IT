const { User } = require('../models/associations');

// Отримати список тільки клієнтів (без адмінів)
exports.getClients = async (req, res) => {
    try {
        const clients = await User.findAll({
            where: { role: 'client' },
            attributes: ['id', 'full_name', 'email'] // Пароль не віддаємо
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання клієнтів' });
    }
};