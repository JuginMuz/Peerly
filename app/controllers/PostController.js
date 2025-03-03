// controllers/PostController.js
const PostService = require('../services/PostService');

class PostController {
  static async createPost(req, res) {
    try {
      const newPost = await PostService.createPost(req.body);
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPost(req, res) {
    try {
      const post = await PostService.getPostById(req.params.post_id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(200).json({ post });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostController;
