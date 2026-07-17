require('dotenv').config();

const express = require("express");
const session = require("express-session");
const connection = require("./middleware/connectionDB.js");
const path = require("path");
const requireLogin = require("./middleware/authMiddleware.js");
const cafeModel = require("./models/cafes.js");
const favoritesModel = require("./models/favorites.js");
const reviewModel = require("./models/reviews.js");

// start connection to database
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to the database: " + err.stack);
        return;
    }
    console.log("Connected to the database as id " + connection.threadId);
});

// start app
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
    session({
        secret: "lady hear me tonight",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 3,
        },
    }),
);

// Routes configuration
app.use("/auth", require("./controllers/auth.js"));
app.use("/cafes", require("./controllers/cafes.js"));
app.use("/users", require("./controllers/users.js"));
app.use("/reviews", require("./controllers/reviews.js"));
app.use("/favorites", require("./controllers/favorites.js"));

// Frontend EJS Routes

app.get("/", (req, res) => {
    cafeModel.getRecentCafes((err, recentCafes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("home", { user: req.session.userId || null, recentCafes });
    });
});

app.get("/login-register", (req, res) => {
    res.render("login-register", { message: null, user: req.session.userId || null });
});

app.get("/about-us", (req, res) => {
    res.render("about-us", { user: req.session.userId || null });
});

app.get("/user-profile", requireLogin, (req, res) => {
    const userId = req.session.userId;
    connection.query("SELECT name, username, email FROM users WHERE id = ?", [userId], (err, userResults) => {
        if (err || userResults.length === 0) return res.redirect("/");
        connection.query("SELECT * FROM cafes WHERE user_id = ?", [userId], (err, contributedCafes) => {
            if (err) contributedCafes = [];
            reviewModel.getReviewsByUser(userId, (err, userReviews) => {
                if (err) userReviews = [];
                res.render("user-profile", { user: userResults[0], contributedCafes, userReviews });
            });
        });
    });
});

app.get("/profile/edit", requireLogin, (req, res) => {
    connection.query("SELECT name, username, email FROM users WHERE id = ?", [req.session.userId], (err, results) => {
        if (err || results.length === 0) return res.redirect("/user-profile");
        res.render("edit-profile", { user: results[0] });
    });
});

app.get("/saved-cafes", requireLogin, (req, res) => {
    favoritesModel.getFavoritesByUser(req.session.userId, (err, savedCafes) => {
        if (err) return res.render("saved-cafes", { user: req.session.userId || null, savedCafes: [] });
        res.render("saved-cafes", { user: req.session.userId || null, savedCafes });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
