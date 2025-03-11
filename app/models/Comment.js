// models/Comment.js
const pool = require('./db');

class Comment {
  constructor({ comment_id, user_id, post_id, description, created_at, updated_at }) {
    this.comment_id = comment_id;
    this.user_id = user_id;
    this.post_id = post_id;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /* static async create(commentData) {
    const sql = 'INSERT INTO comments (user_id, post_id, description) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [commentData.user_id, commentData.post_id, commentData.description]);
    return this.findById(result.insertId);
  } */

 
}

module.exports = Comment;
