const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    master_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Автоматично підставляє поточний час
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Appointment',
    timestamps: false // Ми самі керуємо created_at, updated_at немає
});

module.exports = Appointment;