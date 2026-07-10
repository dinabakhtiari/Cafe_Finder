const express = require("express");
const session = require("express-session");
const connection = require("./middleware/connectionDB.js");
const path = require("path");

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

app.get("/profile", (req, res) => {
    res.render("user-profile"); 
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