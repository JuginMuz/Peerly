// services/CommentService.js
const pool = require('../models/db');
const Comment = require('../models/Comment');
const formatDate = require('./utils/FormatDate.js');

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
      return rows.map(row => ({
        ...row,
        created_at: formatDate(row.created_at),
      }));
    }

    static async addComment({ post_id, user_id, description }) {
      await pool.query(`
        INSERT INTO comments (post_id, user_id, description)
        VALUES (?, ?, ?)
      `, [post_id, user_id, description]);
    }
    
    
    

  // Additional methods like update, delete, get comments for a post can be added.
}

module.exports = CommentService;
