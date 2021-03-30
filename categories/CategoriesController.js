const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth");

//Route to Show Categories
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/categories/index", {
            categories: categories
        })
    })
});

//Route to render create new category page
router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
});

//Route used to render edit category page
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id; //Gets ID through form

    if (isNaN(id)) { res.redirect("/admin/categories") } //Checks id ID is a Number

    Category
        .findByPk(id) //Finds category by ID
        .then((category) => {
            if (category != undefined) { //Checks if it found a real Category
                res.render("admin/categories/edit", { category: category }) //Renders editing category page, and passes the category object to Front-end
            } else { //If category non-existant, redirect user to categories page
                res.redirect("/admin/categories")
            }
        })
        .catch((error => { //If it has and error, redirect to categories page and logs error
            res.redirect("/admin/categories")
            console.log(error);
        }))
});

//Route used to save categories to DB
router.post("/admin/categories/save", adminAuth, (req, res) => {
    var title = req.body.title;

    if (title != undefined) { //Checks if the form was filled
        Category
            .create({ title: title, slug: slugify(title) })
            .then(() => { res.redirect("/admin/categories") })
    } else { //redirect to new category page, if form was not filled
        res.redirect("/admin/categories/new")
    }
});

//Route used to delete categories
router.post("/admin/categories/delete", adminAuth, (req, res) => {
    var id = req.body.id; //Gets category ID passed through form
    if (isNaN(id)) { { res.redirect("/admin/categories") } } //Checks if ID passed is a Number

    if (id != undefined) { //Checks if ID passed is a valid input
        Category
            .destroy({ where: { id: id } }) //Destroy category
            .then(() => { res.redirect("/admin/categories") }) //Redirect to categories page    
    } else { res.redirect("/admin/categories") }
})

//Route to update the existing categories
router.post("/admin/categories/update", adminAuth, (req, res) => {
    var id = req.body.id; //Gets ID via form
    var newTitle = req.body.newTitle //Gets newtitle via form

    Category //Update the title and slug in DB
        .update({ title: newTitle, slug: slugify(newTitle) }, { where: { id: id } })
        .then(() => { res.redirect("/admin/categories") })
});

//Exports the function
module.exports = router;