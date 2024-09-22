const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const Hotel = sequelize.define('Hotel', {
    hotel_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    manager_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'user_id'
      }},
    Hotel_name: Sequelize.STRING,
    Location: Sequelize.STRING,
    register_date: Sequelize.DATEONLY,
    Description: Sequelize.TEXT,
    Address: Sequelize.TEXT,
    latitude: Sequelize.STRING,
    longitude: Sequelize.STRING,
    list_of_amenities: Sequelize.TEXT,
    cancellation_policy: Sequelize.INTEGER,
    check_in: Sequelize.STRING,
    check_out: Sequelize.STRING
}, {
    tableName: 'Hotel'
});

module.exports = Hotel;
