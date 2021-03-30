const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category")

//Creates article model for db
const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//Sets the relation between article and category
Category.hasMany(Article)
Article.belongsTo(Category)

module.exports = Article;
