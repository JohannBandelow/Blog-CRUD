//Imports express
const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const session = require("express-session")

//Imports Controller files;
const usersController = require("./user/UsersController")
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

//Imports DB connection
const connection = require("./database/database");

//Database connection
connection
    .authenticate()
    .then(() => { console.log("DB connection ok!") })
    .catch((error) => { console.log(error) });

//Sets viewengine to EJS
app.set('view engine', 'ejs')

//Sets express-session to manage cookies and sessions
app.use(session({
    secret: "aquipodeserescritoqualquercoisaqualquercoisamesmobananacommacaepera",
    cookie: { maxAge: 300000000 }
}))

//Alows express to take info from URL
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Allows express to use static files from the public folder
app.use(express.static('public'));

//Sets express to Use the controller files
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Renders the Home page
app.get("/", (req, res) => {
    Article
        .findAll({ //Gets all articles from DB
            order: [['id', 'DESC']], limit: 4 //Order them by Decreasing ID and limit to 4 articles
        })
        .then((articles) => {
            Category //Gets all Categories, to display them on navbar
                .findAll()
                .then((categories) => { //Renders index and send articles and categories to frontend
                    res.render("index", { articles: articles, categories: categories })
                });
        })
});

//Route to individual article page
app.get("/:slug", (req, res) => {
    var slug = req.params.slug; //Gets slug passed through URL

    Article
        .findOne({ //Searches for correct article
            where: {
                slug: slug
            }
        })
        .then((article) => {
            if (article != undefined) { //Checks if said article exists
                Category
                    .findAll() //Searches for all categories (navbar)
                    .then((categories) => { //Renders article, and sends articles and categories to frontend
                        res.render("article", { articles: articles, categories: categories })
                    });
            } else {
                res.redirect("/")
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

//Route to show all categories to client
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug; //Gets slug via URL

    Category
        .findOne({ where: { slug: slug }, include: [{ model: Article }] })//Search one category that the slug matches
        .then((category) => {
            if (category != undefined) { //Checks if category is valid
                Category
                    .findAll() //Gets all categories and passes all articles that belongs to that category
                    .then((categories) => {
                        res.render("index", { articles: category.articles, categories: categories })
                    })
            } else {
                res.redirect("/")
            }
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/");
        })
})

//Starts the server
app.listen(8080, () => { console.log("Server on!") });