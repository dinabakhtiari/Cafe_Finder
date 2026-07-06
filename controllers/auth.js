const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../middleware/connectionDB.js");

// Redirect manual GET requests back to the main combined page
router.get("/register", (req, res) => {
    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.redirect("/");
});

// Register POST Route
router.post("/register", async (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
<<<<<<< HEAD
        return res.render("login-register", {
            message: "Passwords don't match",
        });
=======
        return res.redirect("/login-register.html?error=passwordmatch");
>>>>>>> c1f9a70a8cbf5453b4c8d04c8d2d1348f7ce5968
    }
    
    try {
        const hashedPwd = await bcryptjs.hash(req.body.password, 10);
        const { username, name, email } = req.body;

<<<<<<< HEAD
        connection.query(
            "INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)",
            [username, name, email, hashedPwd],
            (err, result) => {
                if (err) {
                    return res.render("login-register", {
                        message: "Username or email already in use",
                    });
                }
                req.session.userId = result.insertId;
                res.redirect("/");
            },
        );
    } catch (error) {
        return res.render("login-register", {
            message: "An error occurred during registration. Please try again.",
        });
    }
=======
    connection.query(
        "INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)",
        [username, name, email, hashedPwd],
        (err, result) => {
            if (err) {
                return res.redirect("/login-register.html?error=duplicate");
            }
            req.session.userId = result.insertId;
            res.redirect("/");
        },
    );
});

// Login routes
router.get("/login", (req, res) => {
    res.render("login");
>>>>>>> c1f9a70a8cbf5453b4c8d04c8d2d1348f7ce5968
});

// Login POST Route
router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err || result.length === 0) {
<<<<<<< HEAD
                return res.render("login-register", {
                    message: "Email or password is incorrect",
                });
=======
                return res.redirect("/login-register.html?error=invalid");
>>>>>>> c1f9a70a8cbf5453b4c8d04c8d2d1348f7ce5968
            }
            
            const hashedPwd = result[0].password;
            const pwdMatch = await bcryptjs.compare(password, hashedPwd);
            
            if (pwdMatch) {
                req.session.userId = result[0].id;
                return res.redirect("/home.html");
            } else {
<<<<<<< HEAD
                return res.render("login-register", {
                    message: "Email or password is incorrect",
                });
=======
                return res.redirect("/login-register.html?error=invalid");
>>>>>>> c1f9a70a8cbf5453b4c8d04c8d2d1348f7ce5968
            }
        },
    );
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
<<<<<<< HEAD
            return res.render("login-register", { message: "Could not logout" });
        }
        res.redirect("/");
=======
            return res.redirect("/login-register.html?error=logout");
        }
        return res.redirect("/login-register.html");
>>>>>>> c1f9a70a8cbf5453b4c8d04c8d2d1348f7ce5968
    });
});

module.exports = router;