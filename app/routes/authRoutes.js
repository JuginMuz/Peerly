// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // For findByEmail (used in login)
const Authentication = require('../models/Authentication'); // For verifyPassword (used in login)
const pool = require('../models/db'); // Database connection
const UserService = require('../services/UserService'); // New registration service
const UserController = require('../controllers/UserController');

// POST /login route 
router.post('/login', UserController.login);
 

// POST /register route 
router.post('/register', UserController.register);

module.exports = router;
