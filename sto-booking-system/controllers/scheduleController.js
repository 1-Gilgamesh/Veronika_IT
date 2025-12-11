const { MasterSchedule } = require('../models/associations');

// 1. Отримати графік майстра
exports.getSchedule = async (req, res) => {
    try {
        const { masterId } = req.params;
        const schedule = await MasterSchedule.findAll({ 
            where: { master_id: masterId },
            order: [['day_of_week', 'ASC']]
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання графіку' });
    }
};

// 2. Зберегти графік (перезаписати)
exports.saveSchedule = async (req, res) => {
    try {
        const { masterId } = req.params;
        const { schedule } = req.body; // Масив з 7 днів

        // 1. Видаляємо старий графік
        await MasterSchedule.destroy({ where: { master_id: masterId } });

        // 2. Формуємо нові дані
        const newRows = schedule.map(day => ({
            master_id: masterId,
            day_of_week: day.day_of_week,
            start_time: day.start_time,
            end_time: day.end_time,
            is_working: day.is_working
        }));

        // 3. Записуємо масово
        await MasterSchedule.bulkCreate(newRows);

        res.json({ message: 'Графік збережено успішно' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка збереження' });
    }
};