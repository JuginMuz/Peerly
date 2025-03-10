// services/UserService.js
const pool = require('../models/db');
const User = require('../models/User');
const Authentication = require('../models/Authentication');
const bcrypt = require('bcryptjs');

class UserService {

  // REGISTER
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



  
  //LOGIN
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



  //GET USER PROFILE
  static async findByUserId(user_id) {
    const sql = 'SELECT first_name, last_name, email_id, profile_picture, gender, bio, field_id, dob, city, work_at, went_to, goes_to, relationship_status FROM users WHERE user_id = ?';
    const [rows] = await pool.query(sql, [user_id]);
    return rows.length ? new User(rows[0]) : null;
  }


  //USERS LISTING
  static async getAllUsers() {
    const [rows] = await pool.query(`
      SELECT 
        user_id,
        first_name,
        last_name,
        email_id,
        profile_picture,
        gender,
        bio,
        field_id,
        dob,
        city,
        work_at,
        went_to,
        goes_to,
        relationship_status
      FROM users
      ORDER BY first_name ASC
    `);
    return rows;
  }




  //UPDATE USER PROFILE
  static async updateUserProfile(user_id, updatedData) {
    // Build SET clause dynamically from updatedData keys
    const fields = Object.keys(updatedData)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updatedData);
    // Add user_id as the last parameter
    values.push(user_id);

    const sql = `UPDATE users SET ${fields} WHERE user_id = ?`;
    const [result] = await pool.query(sql, values);
    return result;
  }




  //DELETE ACCOUNT
  static async deleteUserAccount(user_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete related records from authentication, likes, comments, posts, etc.

      // Delete authentication record
      await connection.query('DELETE FROM authentication WHERE user_id = ?', [user_id]);

      // Delete likes by the user (if applicable)
      await connection.query('DELETE FROM likes WHERE user_id = ?', [user_id]);

      // Delete comments made by the user
      await connection.query('DELETE FROM comments WHERE user_id = ?', [user_id]);

      // Delete posts by the user
      await connection.query('DELETE FROM posts WHERE user_id = ?', [user_id]);

      // Finally, delete the user record
      const [result] = await connection.query('DELETE FROM users WHERE user_id = ?', [user_id]);

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = UserService;
