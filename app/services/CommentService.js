// services/CommentService.js

// Import the database pool to execute SQL queries.
const pool = require('../models/db');
// Import the Comment model (currently not used directly in these methods).
const Comment = require('../models/Comment');
// Import the formatDate utility to convert date strings into a readable format.
const formatDate = require('./utils/FormatDate.js');

class CommentService {
  // Retrieve all comments associated with a specific post.
  static async getByPostId(post_id) {
    // SQL query that selects comment details and related user info.
    // It joins the 'comments' table with the 'users' table using the user_id.
    // The results are ordered by the comment creation time in ascending order.
    const sql = `
      SELECT c.description, u.first_name, u.last_name, c.created_at, u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    // Execute the SQL query with the provided post_id parameter.
    const [rows] = await pool.query(sql, [post_id]);
    // Process each row to format the 'created_at' date before returning the result.
    return rows.map(row => ({
      ...row, // Include all properties from the row.
      created_at: formatDate(row.created_at), // Replace 'created_at' with a formatted version.
    }));
  }

  // Add a new comment to a post.
  static async addComment({ post_id, user_id, description }) {
    // SQL query to insert a new comment record into the 'comments' table.
    await pool.query(`
      INSERT INTO comments (post_id, user_id, description)
      VALUES (?, ?, ?)
    `, [post_id, user_id, description]); // Execute with provided values.
  }

  // Count the total number of comments for a specific post.
  static async countComments(post_id) {
    // SQL query that counts all comments linked to the provided post_id.
    const sql = `
      SELECT COUNT(*) AS commentCount
      FROM comments
      WHERE post_id = ?
    `;
    // Execute the query with the post_id parameter.
    const [rows] = await pool.query(sql, [post_id]);
    // Return the count from the first row of the result set.
    return rows[0].commentCount;
  }
}

// Export the CommentService class so it can be used in other parts of the application.
module.exports = CommentService;
