const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const FAQ = sequelize.define('FAQ', {
    faq_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Q: Sequelize.TEXT,
    A: Sequelize.TEXT,
    hotel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotel_id'
      }
    }
}, {
    tableName: 'FAQ'
});
  

module.exports = FAQ;