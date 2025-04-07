// routes/commentRoutes.js

// Import Express so we can use its routing features.
const express = require('express');
// Create a new router instance to define our comment-related routes.
const router = express.Router();

// Import the CommentController, which contains our logic for handling comment actions.
const CommentController = require('../controllers/CommentController');

// Define a POST route for creating a new comment.
// The route expects a post ID as a parameter in the URL (':post_id/').
// When this route is hit, it calls the createComment method from CommentController.
router.post('/:post_id/', CommentController.createComment);

// Export the router so it can be mounted in the main application.
module.exports = router;
