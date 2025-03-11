// services/UserService.js
const pool = require('../models/db');
const User = require('../models/User');
const Authentication = require('../models/Authentication');
const bcrypt = require('bcryptjs');

class UserService {

  // REGISTER
  /* static async register(userData) {
    // Hash the password (assume userData contains plainTextPassword)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.plainTextPassword, saltRounds);
    // Create user (user_id is generated automatically via trigger)
    const newUser = await User.create(userData);
    // Save authentication record
    await Authentication.setPassword(newUser.user_id, hashedPassword);
    return newUser;
  } */



  
  //LOGIN
  /* static async login(email, plainTextPassword) {
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
  } */


  static formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null/undefined dates
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Example output: "May 10, 2000"
  };

  //GET USER PROFILE
 /* static async findByUserId(user_id) {
    const sql = `
      SELECT 
        u.first_name, u.last_name, u.email_id, u.profile_picture, u.gender, 
        u.bio, f.field_name, u.dob, u.city, u.work_at, u.went_to, 
        u.goes_to, u.relationship_status,
        p.media_url, p.description, p.created_at
      FROM users u
      LEFT JOIN fields_of_study f ON u.field_id = f.field_id
      LEFT JOIN posts p ON u.user_id = p.user_id
      WHERE u.user_id = ?;
    `;
  
    const [rows] = await pool.query(sql, [user_id]);
  
    if (!rows.length) return null;
  
    // Extract user info from the first row
    const userInfo = {
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      email_id: rows[0].email_id,
      profile_picture: rows[0].profile_picture,
      gender: rows[0].gender,
      bio: rows[0].bio,
      field_id: rows[0].field_name,
      dob: this.formatDate(rows[0].dob),
      city: rows[0].city,
      work_at: rows[0].work_at,
      went_to: rows[0].went_to,
      goes_to: rows[0].goes_to,
      relationship_status: rows[0].relationship_status,
      
      // Collect all posts, ensuring an empty array if there are no posts
      posts: rows.some(row => row.media_url || row.description)
        ? rows.map(row => ({
            media_url: row.media_url,
            description: row.description,
            created_at: row.created_at
          }))
        : []
    };
  
    return userInfo;
  } */

    
  static async findByUserId(user_id) {
    const sql = `
      SELECT 
        u.first_name, 
        u.last_name, 
        u.email_id, 
        u.profile_picture, 
        u.gender, 
        u.bio, 
        f.field_name AS field_of_study, 
        u.dob, 
        u.city, 
        u.work_at, 
        u.went_to, 
        u.goes_to, 
        u.relationship_status
      FROM users u
      LEFT JOIN fields_of_study f ON u.field_id = f.field_id
      WHERE u.user_id = ?;
    `;
    const [rows] = await pool.query(sql, [user_id]);
    if (!rows.length) return null;

    // Optionally format date using a helper function, e.g., formatDate()
    return {
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      email_id: rows[0].email_id,
      profile_picture: rows[0].profile_picture,
      gender: rows[0].gender,
      bio: rows[0].bio,
      field_of_study: rows[0].field_of_study,
      dob: this.formatDate(rows[0].dob), // You can format this if needed
      city: rows[0].city,
      work_at: rows[0].work_at,
      went_to: rows[0].went_to,
      goes_to: rows[0].goes_to,
      relationship_status: rows[0].relationship_status
    };
  }

  
  




  //USERS LISTING
  static async getAllUsers() {
    const [rows] = await pool.query('SELECT user_id, first_name, last_name, profile_picture FROM users');
    return rows;
  }




  //UPDATE USER PROFILE
  /* static async updateUserProfile(user_id, updatedData) {
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
  } */




  //DELETE ACCOUNT
  /* static async deleteUserAccount(user_id) {
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
  } */
}

module.exports = UserService;
