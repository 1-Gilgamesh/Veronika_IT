const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MasterSchedule = sequelize.define('MasterSchedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    master_id: {
        type: DataTypes.INTEGER,
        allowNull: false
        // Зв'язок налаштуємо пізніше
    },
    day_of_week: {
        type: DataTypes.INTEGER, // 1-7
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    is_working: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'MasterSchedule',
    timestamps: false
});

module.exports = MasterSchedule;