// models/Post.js
const pool = require('./db');

class Post {
  constructor({ post_id, user_id, description, media_url, created_at, updated_at }) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.description = description;
    this.media_url = media_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async create(postData) {
    const sql = 'INSERT INTO posts (user_id, description, media_url) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [postData.user_id, postData.description, postData.media_url]);
    return this.findById(result.insertId);
  }

  static async findById(post_id) {
    const sql = 'SELECT * FROM posts WHERE post_id = ?';
    const [rows] = await pool.query(sql, [post_id]);
    return rows.length ? new Post(rows[0]) : null;
  }
}

module.exports = Post;
