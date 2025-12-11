const { Sequelize } = require('sequelize');
require('dotenv').config(); // Підключаємо змінні з .env

// Створюємо об'єкт підключення
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Назва бази (sto_db)
    process.env.DB_USER,     // Користувач (root)
    process.env.DB_PASSWORD, // Пароль
    {
        host: process.env.DB_HOST, // Хост (localhost)
        dialect: process.env.DB_DIALECT, // Тип бази (mysql)
        logging: false, // Вимикаємо зайвий спам у консоль (можна увімкнути true для налагодження)
    }
);

// Перевірка з'єднання (необов'язково, але корисно для тесту)
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Успішне підключення до бази даних MySQL!');
    } catch (error) {
        console.error('❌ Помилка підключення до БД:', error);
    }
}

testConnection();

module.exports = sequelize;