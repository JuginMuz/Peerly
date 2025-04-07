// services/UserService.js

// Import the database pool to execute SQL queries.
const pool = require('../models/db');
// Import the User model to create user objects from query results.
const User = require('../models/User');
// Import the Authentication model for authentication-related operations (if needed).
const Authentication = require('../models/Authentication');
// Import bcrypt for hashing and verifying passwords.
const bcrypt = require('bcryptjs');
// Import the formatDate utility to format date strings.
const formatDate = require('./utils/FormatDate.js');

class UserService {
  /**
   * Registers a new user.
   * This method handles user registration by validating inputs, ensuring the email is unique,
   * hashing the password, inserting the user record, and adding the hashed password to the authentication table.
   *
   * @param {Object} userData - An object containing user registration details.
   * @returns {string} The newly generated user_id.
   * @throws Will throw an error if registration fails.
   */
  static async register(userData) {
    // Get a dedicated connection from the pool for the transaction.
    const connection = await pool.getConnection();
    try {
      // Begin a transaction to ensure all operations complete together.
      await connection.beginTransaction();

      // Destructure the necessary user details from userData.
      const {
        first_name,
        last_name,
        email,
        password,
        confirm_password,
        gender,
        dob,
        city,
        bio,
        work_at,
        went_to,
        goes_to,
        relationship_status
      } = userData;

      // Ensure the password and confirmation match.
      if (password !== confirm_password) {
        await connection.rollback();
        throw new Error('Passwords do not match.');
      }

      // Check if a user with the provided email already exists.
      const [existingRows] = await connection.query(
        'SELECT * FROM users WHERE email_id = ?',
        [email]
      );
      if (existingRows.length > 0) {
        await connection.rollback();
        throw new Error('User already exists. Please log in instead.');
      }

      // Hash the password using bcrypt.
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert a new user into the 'users' table.
      // A trigger in the database is assumed to generate the proper user_id.
      const insertUserSql = `
        INSERT INTO users 
          (first_name, last_name, email_id, gender, dob, city, bio, work_at, went_to, goes_to, relationship_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.query(insertUserSql, [
        first_name,
        last_name,
        email,
        gender || null,
        dob || null,
        city || null,
        bio || null,
        work_at || null,
        went_to || null,
        goes_to || null,
        relationship_status || null
      ]);

      // Retrieve the auto-generated user_seq from the insert result.
      const newUserSeq = result.insertId;

      // Get the generated user_id using the user_seq.
      const [rows] = await connection.query(
        "SELECT user_id FROM users WHERE user_seq = ?",
        [newUserSeq]
      );
      if (rows.length === 0) {
        await connection.rollback();
        throw new Error("Failed to retrieve the new user's ID.");
      }
      const newUserId = rows[0].user_id;

      // Insert the hashed password into the 'authentication' table.
      await connection.query(
        "INSERT INTO authentication (user_id, password) VALUES (?, ?)",
        [newUserId, hashedPassword]
      );

      // Commit the transaction to save all changes.
      await connection.commit();
      connection.release();

      // Return the new user's ID after successful registration.
      return newUserId;
    } catch (err) {
      // Roll back any changes if an error occurs.
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address to search for.
   * @returns {User|null} A User instance if found, or null if not.
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email_id = ?';
    const [rows] = await pool.query(sql, [email]);
    // Return a new User object if a matching record is found.
    return rows.length ? new User(rows[0]) : null;
  }
  
  /**
   * Finds a user by their user ID.
   *
   * @param {string} user_id - The unique identifier of the user.
   * @returns {Object|null} An object containing user details if found, or null if not.
   */
  static async findByUserId(user_id) {
    // SQL query to retrieve detailed user information along with field of study.
    const sql = `
      SELECT 
        u.user_id,
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
  
    // Return an object with formatted user details.
    return {
      user_id: rows[0].user_id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      email_id: rows[0].email_id,
      profile_picture: rows[0].profile_picture,
      gender: rows[0].gender,
      bio: rows[0].bio,
      field_of_study: rows[0].field_of_study,
      dob: formatDate(rows[0].dob), // Format the date of birth.
      city: rows[0].city,
      work_at: rows[0].work_at,
      went_to: rows[0].went_to,
      goes_to: rows[0].goes_to,
      relationship_status: rows[0].relationship_status
    };
  }
  
  /**
   * Retrieves a list of all users with basic details.
   *
   * @returns {Array} An array of users with user_id, first_name, last_name, and profile_picture.
   */
  static async getAllUsers() {
    const [rows] = await pool.query('SELECT user_id, first_name, last_name, profile_picture FROM users');
    return rows;
  }
  
  /**
   * Updates a user's profile with the provided data.
   *
   * @param {string} user_id - The unique identifier of the user.
   * @param {Object} updatedData - An object containing the fields to update.
   * @returns {object} The result of the update operation.
   */
  static async updateUserProfile(user_id, updatedData) {
    // Get the list of fields to update.
    const fields = Object.keys(updatedData);
    
    // If no fields are provided, return early.
    if (fields.length === 0) {
      return { affectedRows: 0 };
    }
    
    // Dynamically build the SET clause for the SQL UPDATE statement.
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    // Map the values in the same order as the fields.
    const values = fields.map(field => updatedData[field]);
    // Append the user_id for the WHERE clause.
    values.push(user_id);
  
    const sql = `UPDATE users SET ${setClause} WHERE user_id = ?`;
    const [result] = await pool.query(sql, values);
    return result;
  }
  
  /**
   * Deletes a user account along with all associated records.
   * This includes authentication, likes, comments, and posts.
   *
   * @param {string} user_id - The unique identifier of the user to delete.
   * @returns {object} The result of the delete operation.
   * @throws Will throw an error if the deletion process fails.
   */
  static async deleteUserAccount(user_id) {
    // Get a dedicated connection for transaction.
    const connection = await pool.getConnection();
    try {
      // Start a transaction to ensure all deletions occur atomically.
      await connection.beginTransaction();
  
      // Delete the authentication record for the user.
      await connection.query('DELETE FROM authentication WHERE user_id = ?', [user_id]);
  
      // Delete any likes made by the user.
      await connection.query('DELETE FROM likes WHERE user_id = ?', [user_id]);
  
      // Delete comments made by the user.
      await connection.query('DELETE FROM comments WHERE user_id = ?', [user_id]);
  
      // Delete posts created by the user.
      await connection.query('DELETE FROM posts WHERE user_id = ?', [user_id]);
  
      // Finally, delete the user record from the 'users' table.
      const [result] = await connection.query('DELETE FROM users WHERE user_id = ?', [user_id]);
  
      // Commit the transaction after all deletions are successful.
      await connection.commit();
      return result;
    } catch (error) {
      // Roll back the transaction if any error occurs.
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool.
      connection.release();
    }
  }

  /**
   * Searches for users by matching a query against various fields.
   *
   * @param {string} query - The search term.
   * @returns {Array} An array of users that match the search criteria.
   */
  static async searchUsers(query) {
    // Use wildcards to match any occurrence of the query in the fields.
    const wildcard = `%${query}%`;
  
    const [rows] = await pool.query(`
      SELECT 
        user_id, first_name, last_name, profile_picture, bio, city
      FROM users 
      WHERE 
        first_name LIKE ? OR 
        last_name LIKE ? OR 
        user_id LIKE ? OR
        bio LIKE ? OR
        city LIKE ?
    `, [wildcard, wildcard, wildcard, wildcard, wildcard]);
  
    return rows;
  }
  
  /**
   * Retrieves all fields of study available.
   *
   * @returns {Array} An array of fields with their field_id and field_name.
   */
  static async getAllFields() {
    // SQL query to select all available fields from the fields_of_study table.
    const sql = `SELECT field_id, field_name FROM fields_of_study`; // Adjust table name if needed.
    const [rows] = await pool.query(sql);
    return rows;
  }
}

module.exports = UserService;
