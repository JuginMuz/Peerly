// Import the promise-based MySQL library to handle asynchronous database operations.
const mysql = require('mysql2/promise');

// Load environment variables from the .env file to get database configuration.
require("dotenv").config();

// Log the name of the database being used, helpful for debugging.
console.log("Using database:", process.env.MYSQL_DATABASE);

// Create a configuration object for the MySQL connection.
// It uses environment variables if available, otherwise falls back to default values.
const config = {
  host: process.env.MYSQL_HOST || 'localhost',           // Database host; defaults to 'localhost'.
  user: process.env.MYSQL_USER || 'root',                  // Database user; defaults to 'root'.
  password: process.env.MYSQL_PASSWORD || 'password',      // Database password; defaults to 'password'.
  database: process.env.MYSQL_DATABASE || 'sd2_db',        // Database name; defaults to 'sd2_db'.
  port: process.env.DB_PORT || 3306,                       // Database port; defaults to 3306.
};

// Create a connection pool using the configuration.
// A pool manages multiple connections and optimizes performance for concurrent queries.
const pool = mysql.createPool(config);

// Export the pool so it can be reused in other parts of the application.
module.exports = pool;
