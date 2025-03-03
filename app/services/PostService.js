// services/PostService.js
const pool = require('../models/db');
const Post = require('../models/Post');

class PostService {
  static async createPost(postData) {
    return Post.create(postData);
  }

  static async getPostById(post_id) {
    return Post.findById(post_id);
  }

  static async getAllPosts() {
    const [rows] = await pool.query('SELECT * FROM posts');
    return rows;
  }

  // Additional methods like update, delete, list by user can be added here.
}

module.exports = PostService;
