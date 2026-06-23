const express = require('express');
const session = require('express-session');
const connection = require("./utils/connection.js");

// start connection to database
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to the database: ' + err.stack);
        return;
    };

    console.log('Connected to the database as id ' + connection.threadId);
});

// start app
const app = express();
const port = 3000;

app.use(express.urlencoded( { extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('views'))

// Session middleware
app.use(session({
    secret: 'lady hear me tonight',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true if using HTTPS in production
        maxAge: 1000 * 60 * 60 * 3 // 3 hours (milliseconds)
    }
}));

app.use('/auth', require('./routes/auth.js'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// close connection to database
// connection.end((err) => {
//     if (err) {
//         console.log('Error closing the database connection: ' + err.stack);
//         return;
//     };
// 
//     console.log('Database connection closed.');
// });
