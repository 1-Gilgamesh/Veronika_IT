const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Імпортуємо налаштування підключення

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('client', 'admin'),
        defaultValue: 'client',
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'User', // Чітко вказуємо ім'я таблиці в БД
    timestamps: false  // Вимикаємо автоматичні поля createdAt/updatedAt
});

module.exports = User;