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
        return res.render("register", {
            message: "Passwords don't match",
        });
    }
    const hashedPwd = await bcryptjs.hash(req.body.password, 10);

    connection.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [req.body.name, req.body.email, hashedPwd],
        (err, result) => {
            if (err) {
                return res.render("register", {
                    message: "Email already in use",
                });
            }
            req.session.userId = result.inserId;
            res.redirect("/dashboard");
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
            if (result.length === 0 || err) {
                return res.render("login", {
                    message: "Email or password is incorrect",
                });
            }
            const hashedPwd = result[0].password;
            const pwdMatch = await bcryptjs.compare(password, hashedPwd);
            if (pwdMatch) {
                req.session.userId = result[0].id;
                return res.redirect("/");
            } else {
                return res.render("login", {
                    message: "Email or password is incorrect",
                });
            }
        },
    );
});

// Logout routes
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render("login", { message: "Could not logout" });
        }
        res.redirect("/auth/login");
    });
});

module.exports = router;
