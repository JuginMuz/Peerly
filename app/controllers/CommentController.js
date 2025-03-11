// controllers/CommentController.js
const CommentService = require('../services/CommentService');

class CommentController {
  /* static async addComment(req, res) {
    try {
      const newComment = await CommentService.addComment(req.body);
      res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } */
}

module.exports = CommentController;
