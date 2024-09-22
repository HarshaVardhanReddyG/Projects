// models/Availabilities.js

const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const Calendar = sequelize.define('Calendar', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'RoomType',
            key: 'room_type_id'
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: true 
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    no_of_avail_rooms: Sequelize.INTEGER
}, {
    tableName: 'Calendar'
});

module.exports = Calendar;
