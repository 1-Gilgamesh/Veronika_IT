const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Payment',
    timestamps: false
});

module.exports = Payment;