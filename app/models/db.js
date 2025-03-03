const mysql = require('mysql2/promise');
require("dotenv").config();

console.log("Using database:", process.env.MYSQL_DATABASE); // Debug log

const config = {
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'sd2_db', // Fallback
  port: process.env.DB_PORT || 3306,
};

const pool = mysql.createPool(config);
module.exports = pool;
