const { Sequelize } = require('sequelize');

// Configuração com o seu banco 'sakila' e sua senha específica
const sequelize = new Sequelize('sakila', 'root', '4P8z5ura..', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  logging: false, // Desativa as mensagens de SQL puro no terminal para ficar mais limpo
  define: {
    timestamps: false // O Sakila não usa createdAt/updatedAt
  }
});

module.exports = sequelize;
