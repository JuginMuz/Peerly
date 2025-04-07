// Import the promise-based MySQL library to work with MySQL databases asynchronously.
const mysql = require('mysql2/promise');

// Load environment variables from a .env file so we can access configuration values.
require("dotenv").config();

// Log the current database name to the console for debugging purposes.
console.log("Using database:", process.env.MYSQL_DATABASE);

// Define the configuration for the MySQL connection.
// Use environment variables if available; otherwise, fall back to default values.
const config = {
  host: process.env.MYSQL_HOST || 'db',                // Database host (default 'db' if not set).
  user: process.env.MYSQL_USER || 'root',              // Database user (default 'root' if not set).
  password: process.env.MYSQL_PASSWORD || 'password',  // Database password (default 'password' if not set).
  database: process.env.MYSQL_DATABASE || 'sd2_db',    // Database name (default 'sd2_db' if not set).
  port: process.env.DB_PORT || 3306,                   // Database port (default 3306 if not set).
};

// Create a connection pool using the configuration.
// A connection pool helps manage multiple database connections efficiently.
const pool = mysql.createPool(config);

// Export the pool so that other parts of the application can use it to interact with the database.
module.exports = pool;
