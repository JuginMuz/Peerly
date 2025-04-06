// routes/homeRoutes.js

// Import Express to create a router.
const express = require('express');
// Create a new router instance for home routes.
const router = express.Router();

// Import the HomeController which contains methods for rendering different home page views.
const HomeController = require('../controllers/HomeController');

// Define a GET route for the sign-in page.
// When a GET request is made to '/signin', HomeController.renderHomePage is called to render the page.
router.get('/signin', HomeController.renderHomePage);

// Define a GET route for the login page.
// This route listens for GET requests at '/login' and calls HomeController.renderLoginPage to render the login page.
router.get('/login', HomeController.renderLoginPage);

// Define a GET route for the register page.
// This route handles GET requests at '/register' by calling HomeController.renderRegisterPage to show the registration form.
router.get('/register', HomeController.renderRegisterPage);

// Export the router so that it can be used in the main app.
module.exports = router;
