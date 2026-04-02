/**
 * Arquivo: database.js
 * Finalidade: Estabelecer a conexao entre o Node.js e o MySQL.
 */
const { Sequelize } = require('sequelize');

// Configuracao da conexao
const sequelize = new Sequelize('sakila', 'root', '4P8z5ura..', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false, // Desativamos o log para nao poluir o terminal com 100.000 inserts
  pool: {
    max: 10,      // Maximo de conexoes simultaneas
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;