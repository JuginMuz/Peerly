// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');

// GET home page
router.get('/', AccountController.renderAccountPage);

module.exports = router;