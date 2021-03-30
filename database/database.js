const Sequelize = require("sequelize");

const connection = new Sequelize('myblog', 'root', '10082001', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;