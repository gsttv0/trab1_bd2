const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Country = sequelize.define('Country', {
  country_id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  country: DataTypes.STRING
}, { tableName: 'country' });

const City = sequelize.define('City', {
  city_id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  city: DataTypes.STRING,
  country_id: { type: DataTypes.SMALLINT }
}, { tableName: 'city' });

const Address = sequelize.define('Address', {
  address_id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  address: DataTypes.STRING,
  district: DataTypes.STRING,
  city_id: { type: DataTypes.SMALLINT },
  phone: DataTypes.STRING,
  location: { type: DataTypes.GEOMETRY, allowNull: true }
}, { tableName: 'address' });

const Film = sequelize.define('Film', {
  film_id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  release_year: DataTypes.INTEGER
}, { tableName: 'film' });

const Customer = sequelize.define('Customer', {
  customer_id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  address_id: { type: DataTypes.SMALLINT },
  store_id: DataTypes.TINYINT
}, { tableName: 'customer' });

const Inventory = sequelize.define('Inventory', {
  inventory_id: { type: DataTypes.MEDIUMINT, primaryKey: true, autoIncrement: true },
  film_id: DataTypes.SMALLINT,
  store_id: DataTypes.TINYINT
}, { tableName: 'inventory' });

const Rental = sequelize.define('Rental', {
  rental_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rental_date: DataTypes.DATE,
  inventory_id: { type: DataTypes.MEDIUMINT },
  customer_id: { type: DataTypes.SMALLINT },
  return_date: { type: DataTypes.DATE, allowNull: true },
  staff_id: DataTypes.TINYINT
}, { tableName: 'rental' });

// RELACIONAMENTOS
City.belongsTo(Country, { foreignKey: 'country_id' });
Address.belongsTo(City, { foreignKey: 'city_id' });
Customer.belongsTo(Address, { foreignKey: 'address_id' });
Inventory.belongsTo(Film, { foreignKey: 'film_id' });
Rental.belongsTo(Customer, { foreignKey: 'customer_id' });
Rental.belongsTo(Inventory, { foreignKey: 'inventory_id' });

module.exports = { Customer, Inventory, Rental, Address, City, Country, Film };