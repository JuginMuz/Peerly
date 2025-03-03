// services/UserService.js
const pool = require('../models/db');
const User = require('../models/User');
const Authentication = require('../models/Authentication');
const bcrypt = require('bcryptjs');

class UserService {
  static async register(userData) {
    // Hash the password (assume userData contains plainTextPassword)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.plainTextPassword, saltRounds);
    // Create user (user_id is generated automatically via trigger)
    const newUser = await User.create(userData);
    // Save authentication record
    await Authentication.setPassword(newUser.user_id, hashedPassword);
    return newUser;
  }

  static async login(email, plainTextPassword) {
    // Find user by email
    const pool = require('../models/db');
    const [rows] = await pool.query('SELECT * FROM users WHERE email_id = ?', [email]);
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    const user = rows[0];
    const storedHash = await Authentication.getPasswordByUserId(user.user_id);
    const match = await bcrypt.compare(plainTextPassword, storedHash);
    if (!match) {
      throw new Error('Invalid password');
    }
    return user;
  }

  static async getUserProfile(user_id) {
    return User.findByUserId(user_id);
  }

  static async getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  }
}

module.exports = UserService;
