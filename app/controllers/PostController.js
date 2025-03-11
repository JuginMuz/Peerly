// controllers/PostController.js
const PostService = require('../services/PostService');

class PostController {

  //ADD POST
  static async createPost(req, res) {
    try {
      const newPost = await PostService.createPost(req.body);
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  //GET POST
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



  //LISTING PAGE
    static async getAllPosts(req, res) {
      try {
        const posts = await PostService.getAllPosts();
        res.render('Home', { 
          title: 'Peerly - Home',
          posts: posts
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).render('error', { 
          title: 'Server Error',
          message: 'Failed to load home page'
        });
      }
    }




  //DELETE A POST
  static async deletePost(req, res) {
    try {
      const postId = req.params.post_id;
      const result = await PostService.deletePost(postId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found or already deleted.' });
      }
      
      res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  //GET POSTS BY USER
  static async getPostsByUser(req, res) {
    try {
      const userId = req.params.user_id;
      const posts = await PostService.getPostsByUser(userId);
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  //GET POSTS BY TAGS
  static async getPostsByTags(req, res) {
    try {
      let { tags } = req.query;
      if (!tags) {
        return res.status(400).json({ error: 'No tags provided' });
      }
      // Convert comma-separated string to an array if necessary.
      if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
      }
      const posts = await PostService.getPostsByTags(tags);
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostController;
