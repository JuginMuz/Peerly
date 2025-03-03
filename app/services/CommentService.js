// services/CommentService.js
const pool = require('../models/db');
const Comment = require('../models/Comment');

class CommentService {
  static async addComment(commentData) {
    return Comment.create(commentData);
  }

  // Additional methods like update, delete, get comments for a post can be added.
}

module.exports = CommentService;
