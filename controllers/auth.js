const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../middleware/connectionDB.js");

router.get("/register", (req, res) => {
    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.redirect("/");
});

router.post("/register", async (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
        return res.render("login-register", {
            message: "Passwords don't match",
        });
    }

    try {
        const hashedPwd = await bcryptjs.hash(req.body.password, 10);
        const { username, name, email } = req.body;

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
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err || result.length === 0) {
                return res.render("login-register", {
                    message: "Email or password is incorrect",
                });
            }

            const hashedPwd = result[0].password;
            const pwdMatch = await bcryptjs.compare(password, hashedPwd);

            if (pwdMatch) {
                req.session.userId = result[0].id;
                return res.redirect("/");
            } else {
                return res.render("login-register", {
                    message: "Email or password is incorrect",
                });
            }
        },
    );
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render("login-register", { message: "Could not logout" });
        }
        res.redirect("/login-register");
    });
});

module.exports = router;
