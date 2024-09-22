require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.connectionUrl, {
  dialect: 'postgres',
  ssl: true, // Enable SSL
  dialectOptions: {
    ssl: {
      require: true, // Require SSL
      rejectUnauthorized: false // Disable verification of the SSL certificate (use only in development, NOT recommended for production)
    }
  }
});

module.exports = sequelize;
