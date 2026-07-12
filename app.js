require('dotenv').config();

const express = require("express");
const session = require("express-session");
const connection = require("./middleware/connectionDB.js");
const path = require("path");
const requireLogin = require("./middleware/authMiddleware.js");
const cafeModel = require("./models/cafes.js");

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
            secure: false, // true if using HTTPS in production
            maxAge: 1000 * 60 * 60 * 3, // 3 hours (milliseconds)
        },
    }),
);

// Routes configuration
app.use("/auth", require("./controllers/auth.js"));
app.use("/cafes", require("./controllers/cafes.js"));
app.use("/users", require("./controllers/users.js"));
app.use("/reviews", require("./controllers/reviews.js"));
app.use("/favorites", require("./controllers/favorites.js"));

app.get("/", (req, res) => {
    cafeModel.getRecentCafes((err, recentCafes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("home", { user: req.session.userId || null, recentCafes });
    });
});

app.get("/login-register", (req, res) => {
    res.render("login-register", { message: null, user: req.session.userId || null });
});

app.get("/search-results", (req, res) => {
    res.render("search-results", { user: req.session.userId || null, cafes: [], searchTerm: "" });
});

app.get("/user-profile", requireLogin, (req, res) => {
    res.render("user-profile", { user: req.session.userId || null });
});

app.get("/saved-cafes", requireLogin, (req, res) => {
    res.render("saved-cafes", { user: req.session.userId || null });
});

app.get("/about-us", (req, res) => {
    res.render("about-us", { user: req.session.userId || null });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// close connection to database
// connection.end((err) => {
//     if (err) {
//         console.log('Error closing the database connection: ' + err.stack);
//         return;
//     };
//
//     console.log('Database connection closed.');
// });