// models/Authentication.js

const pool = require('./db'); // Database pool to execute SQL queries.
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords.

class Authentication {
  constructor({ user_id, password }) {
    this.user_id = user_id; // Set the user ID.
    this.password = password; // Set the user password.
  }

  // Save the hashed password for a user in the database.
  static async setPassword(user_id, hashedPassword) {
    const sql = 'INSERT INTO authentication (user_id, password) VALUES (?, ?)'; // SQL query to insert data.
    const [result] = await pool.query(sql, [user_id, hashedPassword]); // Run the query with provided parameters.
    return result; // Return the query result.
  }

  // Retrieve the hashed password for a specific user.
  static async getPasswordByUserId(user_id) {
    const sql = 'SELECT password FROM authentication WHERE user_id = ?'; // SQL query to fetch password.
    const [rows] = await pool.query(sql, [user_id]); // Execute the query.
    return rows.length ? rows[0].password : null; // Return the password if found, otherwise null.
  }

  // Check if the provided plain password matches the stored hashed password.
  static async verifyPassword(user_id, plainPassword) {
    const hashedPassword = await this.getPasswordByUserId(user_id); // Get the stored hash.
    if (!hashedPassword) return false; // Return false if no password is found.
    return await bcrypt.compare(plainPassword, hashedPassword); // Compare and return the result.
  }
}

module.exports = Authentication; // Export the class for use in other files.
