// routes/userRoutes.js

// Import Express to create our router.
const express = require('express');
// Create a new router instance for user-related routes.
const router = express.Router();

// Import the UserController which handles logic for user operations.
const UserController = require('../controllers/UserController');
// Import the PostController to handle operations related to posts.
const PostController = require('../controllers/PostController');
// Import the profileUpload middleware to handle profile picture uploads.
const { profileUpload } = require('../models/upload');

// Route to display the settings page for a specific user.
// This page typically shows user details, available fields, posts, etc.
router.get('/:user_id/settings', UserController.getSettingsPage);

// Route to display a single user's profile by user_id.
router.get('/:user_id', UserController.getProfile);

// Route to display all users, often used on an "explore" or "make friends" page.
router.get('/', UserController.getAllUsers);

// Route to update a user's profile.
// Uses profileUpload middleware to handle a new profile picture upload (field name: 'profilePic').
router.post('/:user_id/updateProfile', profileUpload.single('profilePic'), UserController.updateProfile);

// Route to delete a user account.
router.post('/:user_id/deleteAccount', UserController.deleteAccount);

// Route to delete a specific post for a user.
// Expects both user_id and post_id in the URL.
router.post('/:user_id/deletePost/:post_id', PostController.deletePost);

// Duplicate routes (Note: These duplicate routes might need to be removed to avoid conflicts)
// They are re-defining getProfile and getAllUsers routes.
// It is recommended to keep only one instance of each route.
router.get('/:user_id', UserController.getProfile);
router.get('/', UserController.getAllUsers);

// Route to search for users by a search term.
// The search term is expected to be provided as a query parameter (e.g., /search/byword?q=...).
router.get('/search/byword', UserController.search);

// Export the router so it can be mounted in the main application.
module.exports = router;
