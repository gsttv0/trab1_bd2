const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sakila', 'root', '4P8z5ura..', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});
module.exports = sequelize;