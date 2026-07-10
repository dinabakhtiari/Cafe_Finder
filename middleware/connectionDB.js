require('dotenv').config({ override: true });
const mysql = require('mysql2');

const connection = mysql.createConnection({
host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE || 'cafe_finder'
});

module.exports = connection;
