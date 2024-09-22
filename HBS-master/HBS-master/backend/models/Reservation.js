const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const Reservation = sequelize.define('Reservation', {
    rid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booked_date: Sequelize.DATEONLY,
    start_date: Sequelize.DATEONLY,
    end_date: Sequelize.DATEONLY,
    gid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'GroupRoom',
        key: 'gid'
      }
    },
    hotel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotel_id'
      }
    },
    room_type_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'RoomType',
        key: 'room_type_id'
      }
    },
    No_of_rooms: Sequelize.INTEGER,
    payment: Sequelize.INTEGER,
    status : {
      type: Sequelize.ENUM('cancelled', 'accepted', 'rejected' , 'pending', 'temporary'),
      defaultValue: 'accepted'
    }
}, {
    tableName: 'Reservation'
});

module.exports = Reservation;