const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TimeBlock = sequelize.define('TimeBlock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    master_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_datetime: {
        type: DataTypes.DATE, // В Sequelize DATETIME це DATE
        allowNull: false
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'TimeBlock',
    timestamps: false
});

module.exports = TimeBlock;