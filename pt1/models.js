const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Film = sequelize.define('Film', {
  filmId: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true, field: 'film_id' },
  title: { type: DataTypes.STRING }
}, { tableName: 'film', timestamps: false });

const Inventory = sequelize.define('Inventory', {
  inventoryId: { type: DataTypes.MEDIUMINT, primaryKey: true, autoIncrement: true, field: 'inventory_id' },
  filmId: { type: DataTypes.SMALLINT, field: 'film_id' },
  storeId: { type: DataTypes.TINYINT, field: 'store_id' }
}, { tableName: 'inventory', timestamps: false });

const Customer = sequelize.define('Customer', {
  customerId: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true, field: 'customer_id' },
  firstName: { type: DataTypes.STRING, field: 'first_name' },
  lastName: { type: DataTypes.STRING, field: 'last_name' },
  addressId: { type: DataTypes.SMALLINT, field: 'address_id' },
  storeId: { type: DataTypes.TINYINT, field: 'store_id' }
}, { tableName: 'customer', timestamps: false });

const Rental = sequelize.define('Rental', {
  rentalId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'rental_id' },
  rentalDate: { type: DataTypes.DATE, field: 'rental_date' },
  inventoryId: { type: DataTypes.MEDIUMINT, field: 'inventory_id' },
  customerId: { type: DataTypes.SMALLINT, field: 'customer_id' },
  staffId: { type: DataTypes.TINYINT, field: 'staff_id' }
}, { tableName: 'rental', timestamps: false });

Film.hasMany(Inventory, { foreignKey: 'filmId' });
Inventory.belongsTo(Film, { foreignKey: 'filmId' });
Customer.hasMany(Rental, { foreignKey: 'customerId' });
Rental.belongsTo(Customer, { foreignKey: 'customerId' });
Inventory.hasMany(Rental, { foreignKey: 'inventoryId' });
Rental.belongsTo(Inventory, { foreignKey: 'inventoryId' });

module.exports = { Film, Inventory, Customer, Rental };