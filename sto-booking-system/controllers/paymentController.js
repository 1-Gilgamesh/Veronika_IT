const { Payment, Appointment } = require('../models/associations');

exports.processPayment = async (req, res) => {
    try {
        const { appointment_id, amount, payment_method } = req.body;

        // Імітація транзакції (генеруємо випадковий ID)
        const transaction_id = 'TXN-' + Date.now() + Math.floor(Math.random() * 1000);

        // Створюємо запис про оплату
        const payment = await Payment.create({
            appointment_id,
            amount,
            payment_method, // 'card'
            payment_status: 'paid',
            transaction_id,
            payment_date: new Date()
        });

        // Оновлюємо статус самого запису на 'confirmed' (бо гроші отримано)
        await Appointment.update(
            { status: 'confirmed' },
            { where: { id: appointment_id } }
        );

        res.status(201).json({ message: 'Оплата успішна', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка оплати' });
    }
};