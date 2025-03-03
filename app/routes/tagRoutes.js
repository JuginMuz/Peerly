// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

router.post('/', TagController.createTag);

module.exports = router;
