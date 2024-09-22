const Sequelize = require('sequelize');
const sequelize = require('../config.js');

const Image = sequelize.define('Image', {
    image_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: Sequelize.STRING,
    hotel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotel_id'
      }
    }
}, {
    tableName: 'Image'
});

module.exports = Image;