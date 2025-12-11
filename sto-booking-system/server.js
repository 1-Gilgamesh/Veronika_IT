// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // підключеня до БД
const serviceRoutes = require('./routes/serviceRoutes'); // імпорт маршруту
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

require('./models/associations'); // імпортування моделей


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API працює!' });
});

// 2. ПІДКЛЮЧЕННЯ МАРШРУТУ
// Всі запити, що починаються з /api/services, підуть у файл serviceRoutes
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// СИНХРОНІЗАЦІЯ З БАЗОЮ
// Ця команда перевіряє, чи відповідають моделі таблицям у базі
const startServer = async () => {
    try {
        // alter: true означає "якщо щось змінилося в коді, онови таблицю в БД"
        // Але будьте обережні з цим на реальних даних!
        await sequelize.sync({ alter: true }); 
        console.log('✅ Моделі синхронізовано з БД');

        app.listen(PORT, () => {
            console.log(`Сервер запущено: http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('❌ Помилка запуску сервера:', e);
    }
};

startServer();