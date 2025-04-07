// routes/postRoutes.js

// Import Express to create our router.
const express = require('express');
// Create a new router instance for handling post-related routes.
const router = express.Router();

// Import the PostController that contains all logic for post actions.
const PostController = require('../controllers/PostController');
// Import the postUpload middleware for handling image uploads.
const { postUpload } = require('../models/upload');

// Route to get the details of a specific post.
// It expects a post ID as a URL parameter and renders the post details page.
router.get('/:post_id', PostController.getPostDetails);

// Route to fetch and display all posts.
// This is typically used to render the home or listing page with all posts.
router.get('/', PostController.getAllPosts);

// Route to display the form for creating a new post.
// This GET route renders the create post form.
router.get('/create/Post', PostController.showCreateForm);

// Route to handle the submission of a new post.
// It uses the postUpload middleware to handle the file upload (with the field name 'postImage'),
// then calls the createPost method to save the post details.
router.post('/create/NewPost', postUpload.single('postImage'), PostController.createPost);

// Route to search for posts based on a query string.
// The search term is passed as a query parameter.
router.get('/posts/search', PostController.search);

// Route to toggle the like status on a post.
// It expects the post ID as a URL parameter and calls the toggleLike method.
router.post('/:post_id/like', PostController.toggleLike);

// Export the router so it can be integrated into the main application.
module.exports = router;
