// services/CommentService.js
const pool = require('../models/db');
const Comment = require('../models/Comment');

class CommentService {
  /* static async addComment(commentData) {
    return Comment.create(commentData);
  } */

    static async getByPostId(post_id) {
      const sql = `
        SELECT c.description, u.first_name, u.last_name, c.created_at, u.profile_picture
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `;
      const [rows] = await pool.query(sql, [post_id]);
      return rows; // returns an array of objects containing description, first_name, last_name, and created_at
    }
    
    

  // Additional methods like update, delete, get comments for a post can be added.
}

module.exports = CommentService;
