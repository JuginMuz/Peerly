// models/Comment.js
const pool = require('./db');

// This class represents a comment on a post.
class Comment {
  constructor({ comment_id, user_id, post_id, description, created_at, updated_at }) {
    // Sets up the comment properties from the provided data.
    this.comment_id = comment_id;
    this.user_id = user_id;
    this.post_id = post_id;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // The create method below shows how we might insert a new comment into the database.
  // It's commented out for now since we're not using it directly.
  /*
  static async create(commentData) {
    // Builds the SQL query to insert the new comment using the user ID, post ID, and the comment text.
    const sql = 'INSERT INTO comments (user_id, post_id, description) VALUES (?, ?, ?)';
    // Runs the query with the provided comment data.
    const [result] = await pool.query(sql, [commentData.user_id, commentData.post_id, commentData.description]);
    // After insertion, return the newly created comment by its ID.
    return this.findById(result.insertId);
  }
  */
}

module.exports = Comment;
