// routes/authRoutes.js

// Import Express and create a new router instance.
const express = require('express');
const router = express.Router();

// Import bcrypt for password hashing and comparison.
const bcrypt = require('bcryptjs');

// Import the Authentication model to verify passwords.
const Authentication = require('../models/Authentication');

// Import the database connection pool.
const pool = require('../models/db');

// Import UserService for handling new user registration and fetching user details.
const UserService = require('../services/UserService');

// POST /login route: handles user login.
router.post('/login', async (req, res, next) => {
  try {
    // Extract email and password from the request body.
    const { email, password } = req.body;

    // Attempt to find a user with the provided email.
    const user = await UserService.findByEmail(email);
    if (!user) {
      // If no user is found, respond with a 401 Unauthorized status.
      return res.status(401).render('error', {
        title: 'Unauthorized',
        message: 'Invalid email or password.'
    }
)}

    // Verify that the provided password matches the stored hashed password.
    const validPassword = await Authentication.verifyPassword(user.user_id, password);
    if (!validPassword) {
      // If the password doesn't match, respond with a 401 Unauthorized status.
      return res.status(401).render('error', {
        title: 'Unauthorized',
        message: 'Invalid email or password.'
    }
)}

    // If authentication is successful, store user details in the session.
    req.session.user_id = user.user_id; // Store user ID from the database.
    req.session.email = user.email_id;   // Store email for quick reference.
    req.session.profile_picture = user.profile_picture; // Store profile picture path.

    // Redirect the user to the home page after successful login.
    return res.redirect('/api/home');
  } catch (err) {
    // Pass any errors to the next middleware (error handler).
    next(err);
  }
});

// POST /register route: handles new user registration.
router.post('/register', async (req, res) => {
  try {
    // Register a new user using the details provided in the request body.
    await UserService.register(req.body);
    // After successful registration, redirect the user to the login page.
    return res.redirect('/api/login');
  } catch (err) {
    // Log any registration errors to the console for debugging.
    console.error("Registration error:", err);
    // Respond with a 500 status code and a generic error message.
    return res.status(500).render('error', {
      title: 'Registration Error',
      message: 'Sorry! But we could not register you. Please try again'
    })
  }
});

router.get('/terms-and-conditions', (req, res) => {
  res.render('terms', { title: 'Terms and Conditions' });
});

// Export the router so it can be used in the main app.
module.exports = router;
