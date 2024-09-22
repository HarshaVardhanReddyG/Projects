const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const RoomType = sequelize.define('RoomType', {
    room_type_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_type_name: Sequelize.STRING,
    no_of_rooms: Sequelize.INTEGER,
    list_of_amenties: Sequelize.TEXT,
    max_guests: Sequelize.INTEGER,
    default_price: Sequelize.INTEGER,
    hotel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotel_id'
      }
    }
}, {
    tableName: 'RoomType'
});

module.exports = RoomType;