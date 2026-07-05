const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../middleware/connectionDB.js");

// Register routes
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect("/login-register.html?error=passwordmatch");
    }
    const hashedPwd = await bcryptjs.hash(req.body.password, 10);
    const { username, name, email } = req.body

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
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err || result.length === 0) {
                return res.redirect("/login-register.html?error=invalid");
            }
            const hashedPwd = result[0].password;
            const pwdMatch = await bcryptjs.compare(password, hashedPwd);
            if (pwdMatch) {
                req.session.userId = result[0].id;
                return res.redirect("/");
            } else {
                return res.redirect("/login-register.html?error=invalid");
            }
        },
    );
});

// Logout routes
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/login-register.html?error=logout");
        }
        return res.redirect("/login-register.html");
    });
});

module.exports = router;
