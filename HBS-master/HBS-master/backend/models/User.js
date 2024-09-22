const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phone_number: Sequelize.STRING,
  country_code: Sequelize.STRING,
  otp: Sequelize.INTEGER,
  otp_expiry_date: Sequelize.DATE,
  usertype: {
    type:  Sequelize.ENUM('guest','HM'),
    default: 'guest'
  }
}, {
    tableName: 'User'
});

module.exports = User;