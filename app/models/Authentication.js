// models/Authentication.js
const pool = require('./db');

class Authentication {
  constructor({ user_id, password }) {
    this.user_id = user_id;
    this.password = password;
  }

  static async setPassword(user_id, hashedPassword) {
    const sql = 'INSERT INTO authentication (user_id, password) VALUES (?, ?)';
    const [result] = await pool.query(sql, [user_id, hashedPassword]);
    return result;
  }

  static async getPasswordByUserId(user_id) {
    const sql = 'SELECT password FROM authentication WHERE user_id = ?';
    const [rows] = await pool.query(sql, [user_id]);
    return rows.length ? rows[0].password : null;
  }
}

module.exports = Authentication;
