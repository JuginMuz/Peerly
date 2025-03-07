// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

// GET home page
router.get('/', HomeController.renderHomePage);

module.exports = router;
