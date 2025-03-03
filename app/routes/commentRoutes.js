// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

router.post('/', CommentController.addComment);

module.exports = router;
