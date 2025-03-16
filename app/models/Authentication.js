// models/Authentication.js
const pool = require('./db');

// This class handles authentication tasks like storing and fetching user passwords.
class Authentication {
  constructor({ user_id, password }) {
    // Initializes our Authentication instance with a user ID and password.
    this.user_id = user_id;
    this.password = password;
  }

  // Saves a hashed password for a user in the database.
  static async setPassword(user_id, hashedPassword) {
    // SQL query to insert the user's ID and hashed password into the authentication table.
    const sql = 'INSERT INTO authentication (user_id, password) VALUES (?, ?)';
    // Executes the query using our database connection pool.
    const [result] = await pool.query(sql, [user_id, hashedPassword]);
    return result;
  }

  // Retrieve the hashed password for a given user.
  static async getPasswordByUserId(user_id) {
    // SQL query to fetch the password for the specified user_id.
    const sql = 'SELECT password FROM authentication WHERE user_id = ?';
    // Runs the query with the provided user_id.
    const [rows] = await pool.query(sql, [user_id]);
    // Returns the password if found; otherwise, return null.
    return rows.length ? rows[0].password : null;
  }
}

module.exports = Authentication;
