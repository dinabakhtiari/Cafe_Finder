const express = require('express');
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
const authRouter = require('./routes/auth.js')

app.use('/', authRouter);

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
