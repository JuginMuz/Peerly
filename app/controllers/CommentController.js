// controllers/CommentController.js
const CommentService = require('../services/CommentService');

class CommentController {
  static async createComment(req, res) {
    try {
      // Get user ID directly from session
      const userId = req.session.user_id;

      // Check if user is logged in
      if (!userId) {
        return res.status(401).render('error', {
          title: 'Unauthorized',
          message: 'You must be logged in to post a comment.'
        });
      }

      const postId = req.params.post_id;
      const { description } = req.body;

      // Validate comment
      if (!description || !description.trim()) {
        return res.status(400).render('error', {
          title: 'Invalid Comment',
          message: 'Comment cannot be empty.'
        });
      }

      // Call the service to add the comment
      await CommentService.addComment({
        post_id: postId,
        user_id: userId,      // <-- Use userId from session
        description: description.trim()
      });

      // Redirect to post details
      return res.redirect(`/api/home/${postId}`);
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      return res.status(500).render('error', {
        title: 'Server Error',
        message: 'Could not post comment. Please try again later.'
      });
    }
  }
}

module.exports = CommentController;
