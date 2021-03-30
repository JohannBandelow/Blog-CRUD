const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

//Route used to show all users
router.get("/admin/users", adminAuth, (req, res) => {
    User
        .findAll() //Gets all users from DB
        .then((users) => {
            res.render("admin/users/index", { users: users }) //Renders users page, sending all users
        })
        .catch((error) => { console.log(error) })
});

//Route used to create new users
router.get("/admin/users/new", adminAuth, (req, res) => {
    res.render("admin/users/create") //Renders form to create users page
})

//Route used to login
router.get("/login", (req, res) => {
    res.render("admin/users/login")
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;

    res.redirect("/")
})

//Route used to check if login and password are right, and saves session
router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password

    User
        .findOne({ where: { email: email } })
        .then((user) => {
            if (user != undefined) {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }
                    res.redirect("/admin/categories")
                } else {
                    res.redirect("/login");
                }
            } else {
                res.redirect("/login")
            }
        })
})

//Route used to save the new users
router.post("/admin/users/save", adminAuth, (req, res) => {
    //Gets email and password from the front-end form
    var email = req.body.email;
    var password = req.body.password;

    //Searches for the email in Db, to not have duplicate emails
    User
        .findOne({ where: { email: email } }) //Searches for passed email in Db
        .then((newUser) => {
            if (newUser == undefined) { //Checks if email found in db is real value
                var salt = bcrypt.genSaltSync(10); //Creates a salt (Seasoning to increase encryption)
                var hash = bcrypt.hashSync(password, salt); //Creates a hash for password

                //Creates a new user, passing email and hash to db, then redirects user to users pageS
                User
                    .create({ email: email, password: hash })
                    .then(() => { res.redirect("/admin/users") })
                    .catch((error) => {
                        console.log(error)
                        res.redirect("/")
                    })
                //Redirects user to homepage, and logs tha email already exists       
            } else {
                res.redirect("/")
                console.log("Email ja cadastrado!")
            }
        })
})

//Exports the router module
module.exports = router;