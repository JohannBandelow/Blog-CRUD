const Sequelize = require("sequelize");
const connection = require("../database/database");

//Creates User model to db
const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Exports the user module
module.exports = User;
