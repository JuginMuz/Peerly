// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // For findByEmail (used in login)
const Authentication = require('../models/Authentication'); // For verifyPassword (used in login)
const pool = require('../models/db'); // Database connection
const UserService = require('../services/UserService'); // New registration service

// POST /login route 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Finds the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).send('Invalid email or password.');
    }

    // Verify's password
    const validPassword = await Authentication.verifyPassword(user.user_id, password);
    if (!validPassword) {
      return res.status(401).send('Invalid email or password.');
    }

    // If valid, stores user info in the session
    req.session.userId = user.user_id; // user_id from the DB
    req.session.email = user.email_id;  // for quick reference

    //Redirects to home page
    return res.redirect('/api/home');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

// POST /register route 
router.post('/register', async (req, res) => {
  try {
    await UserService.register(req.body);
    // Redirects to login after successful registration
    return res.redirect('/api/login');
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).send("Server error during registration");
  }
});

module.exports = router;
