// routes/tagRoutes.js

// Import Express to create a router.
const express = require('express');
// Create a new router instance for tag-related routes.
const router = express.Router();

// Import the TagController which handles logic for tag-based operations.
const TagController = require('../controllers/TagController');

// Define a GET route that receives a tag_id as a parameter.
// This route will fetch posts associated with the given tag and render the view accordingly.
router.get('/:tag_id', TagController.getPostsByTags);

// Export the router so it can be used in the main application.
module.exports = router;
