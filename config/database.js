const { Sequelize } = require('sequelize');

module.exports = new Sequelize('login', 'postgres', '1234', {
	host: 'localhost',
	dialect: 'postgres',
});
