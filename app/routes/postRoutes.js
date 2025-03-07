// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

router.post('/create', PostController.createPost);
router.get('/:post_id', PostController.getPost);
router.get('/', PostController.getAllPosts);
router.delete('/:post_id', PostController.deletePost);
router.get('/user/:user_id', PostController.getPostsByUser);
router.get('/tags', PostController.getPostsByTags)

module.exports = router;
