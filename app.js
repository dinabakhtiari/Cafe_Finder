const express = require("express");
const session = require("express-session");
const connection = require("./middleware/connectionDB.js");
const path = require("path");
// Added the auth middleware so we can protect the profile route
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

// Backend API Routes (Henrique's refactor)
app.use("/auth", require("./controllers/auth.js"));
app.use("/cafes", require("./controllers/cafes.js"));
app.use("/users", require("./controllers/users.js"));
app.use("/reviews", require("./controllers/reviews.js"));
app.use("/favorites", require("./controllers/favorites.js"));

// Frontend EJS Routes (Your refactor)
app.get("/", (req, res) => {
    res.render("login-register", { message: null });
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/about-us", (req, res) => {
    res.render("about-us");
});

// Dynamic Profile Route!
app.get("/profile", requireLogin, (req, res) => {
    const userId = req.session.userId;
    const query = "SELECT name, username, email FROM users WHERE id = ?";
    
    connection.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error fetching user profile:", err);
            return res.render("user-profile", { user: null });
        }

        // Render the page and pass the specific logged-in user's data!
        res.render("user-profile", { user: results[0] });
    });
});

// Start Server
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