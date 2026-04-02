const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Person = sequelize.define('Person', {
  // Mudamos para STRING para garantir que o 'NaN' ou aspas nao quebrem a carga
  index: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    allowNull: false 
  },
  userId: { type: DataTypes.STRING, field: 'user_id' },
  firstName: { type: DataTypes.STRING, field: 'first_name' },
  lastName: { type: DataTypes.STRING, field: 'last_name' },
  sex: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.STRING, field: 'date_of_birth' },
  jobTitle: { type: DataTypes.STRING, field: 'job_title' }
}, { 
  tableName: 'people', 
  timestamps: false 
});

module.exports = { Person };