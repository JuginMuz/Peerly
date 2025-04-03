// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

router.post('/:post_id/', CommentController.createComment);


module.exports = router;
