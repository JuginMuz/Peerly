// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { postUpload } = require('../models/upload'); 

// router.post('/create', PostController.createPost);
// router.delete('/:post_id', PostController.deletePost);

router.get('/:post_id', PostController.getPostDetails);
router.get('/', PostController.getAllPosts);
router.get('/create/Post', PostController.showCreateForm);

  
router.post('/create/NewPost', postUpload.single('postImage'), PostController.createPost);
router.get('/posts/search', PostController.search);

router.post('/:post_id/like', PostController.toggleLike);



  



module.exports = router;
