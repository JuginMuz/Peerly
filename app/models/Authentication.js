// models/Authentication.js
const pool = require('./db');
const bcrypt = require('bcryptjs');

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
    const sql = 'SELECT password FROM authentication WHERE user_id = ?';
    const [rows] = await pool.query(sql, [user_id]);
    return rows.length ? rows[0].password : null;
  }

  // Compares an incoming plain password to the stored hashed password
  static async verifyPassword(user_id, plainPassword) {
    const hashedPassword = await this.getPasswordByUserId(user_id);
    if (!hashedPassword) return false;
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
module.exports = Authentication;
