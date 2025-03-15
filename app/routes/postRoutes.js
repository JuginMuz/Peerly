// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

// router.post('/create', PostController.createPost);
// router.delete('/:post_id', PostController.deletePost);

router.get('/:post_id', PostController.getPostDetails);
router.get('/', PostController.getAllPosts);




module.exports = router;
