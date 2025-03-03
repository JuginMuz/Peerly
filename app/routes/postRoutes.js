// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

router.post('/', PostController.createPost);
router.get('/:post_id', PostController.getPost);

module.exports = router;
