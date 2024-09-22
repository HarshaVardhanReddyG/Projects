const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const GroupRoom = sequelize.define('GroupRoom', {
    gid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    hotel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotel_id'
      }
    },
    Review: Sequelize.TEXT,
    Rating: Sequelize.INTEGER
}, {
    tableName: 'GroupRoom'
});

module.exports = GroupRoom;