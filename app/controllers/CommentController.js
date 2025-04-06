// controllers/CommentController.js

// Import the CommentService which contains business logic for handling comments.
const CommentService = require('../services/CommentService');

class CommentController {
  /**
   * Handles the creation of a new comment.
   * It verifies that the user is logged in, validates the comment content,
   * and then calls the service to store the comment in the database.
   *
   * @param {object} req - The request object containing session and parameters.
   * @param {object} res - The response object used to send back HTTP responses.
   */
  static async createComment(req, res) {
    try {
      // Retrieve the user ID from the session.
      const userId = req.session.user_id;

      // If there is no user ID in the session, the user is not logged in.
      // Return a 401 Unauthorized error and render an error page.
      if (!userId) {
        return res.status(401).render('error', {
          title: 'Unauthorized',
          message: 'You must be logged in to post a comment.'
        });
      }

      // Retrieve the post ID from the request parameters.
      const postId = req.params.post_id;
      // Extract the comment description from the request body.
      const { description } = req.body;

      // Validate the comment: it should not be empty or contain only whitespace.
      if (!description || !description.trim()) {
        return res.status(400).render('error', {
          title: 'Invalid Comment',
          message: 'Comment cannot be empty.'
        });
      }

      // Call the CommentService to add the new comment.
      // The service will handle inserting the comment into the database.
      await CommentService.addComment({
        post_id: postId,
        user_id: userId, // Use the user ID from the session for authentication.
        description: description.trim() // Trim any extra whitespace from the comment.
      });

      // After successfully adding the comment, redirect the user to the post details page.
      return res.redirect(`/api/home/${postId}`);
    } catch (error) {
      // Log the error to the server console for debugging.
      console.error('❌ Error adding comment:', error);
      // If an error occurs, respond with a 500 Server Error and render an error page.
      return res.status(500).render('error', {
        title: 'Server Error',
        message: 'Could not post comment. Please try again later.'
      });
    }
  }
}

// Export the CommentController class so it can be used by routing modules.
module.exports = CommentController;
