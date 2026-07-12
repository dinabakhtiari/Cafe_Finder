require('dotenv').config();

const express = require("express");
const session = require("express-session");
const connection = require("./middleware/connectionDB.js");
const path = require("path");
const requireLogin = require("./middleware/authMiddleware.js");

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
// Fix for user-uploaded cafe photos!
app.use('/uploads', express.static(path.join(__dirname, "uploads"))); 

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

// Frontend EJS Routes

// Load home page by default (Team agreed on this!)
app.get("/", (req, res) => {
    res.render("home", { user: req.session.userId || null });
});

// Kept for backward compatibility if links point to /home
app.get("/home", (req, res) => {
    res.render("home", { user: req.session.userId || null });
});

// Login/Register page
app.get("/login-register", (req, res) => {
    res.render("login-register", { message: null, user: req.session.userId || null });
});

// About Us
app.get("/about-us", (req, res) => {
    res.render("about-us", { user: req.session.userId || null });
});

// Saved Cafes
app.get("/saved-cafes", requireLogin, (req, res) => {
    res.render("saved-cafes", { user: req.session.userId || null });
});

// 1. THE MAIN PROFILE ROUTE (This was missing!)
app.get("/profile", requireLogin, (req, res) => {
    const userId = req.session.userId;
    const query = "SELECT name, username, email FROM users WHERE id = ?";
    
    connection.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error fetching user profile:", err);
            return res.render("user-profile", { user: null });
        }
        res.render("user-profile", { user: results[0] });
    });
});

// 2. THE EDIT PROFILE FORM
app.get("/profile/edit", requireLogin, (req, res) => {
    const userId = req.session.userId;
    const query = "SELECT name, username, email FROM users WHERE id = ?";
    
    connection.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error fetching user profile for edit:", err);
            return res.redirect("/profile");
        }
        res.render("edit-profile", { user: results[0] });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});