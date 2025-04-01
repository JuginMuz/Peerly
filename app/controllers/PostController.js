// controllers/PostController.js
const CommentService = require('../services/CommentService');
const PostService = require('../services/PostService');
const TagService = require('../services/TagService');

class PostController {
  // SHOW THE "CREATE POST" FORM (GET ROUTE)
  static async showCreateForm(req, res) {
    try {
      // Fetch available tags to display as checkboxes
      const availableTags = await TagService.getAllTags() || [];
      // Render the create_post.pug template
      res.render('create_post', { 
        tags: availableTags 
      });
    } catch (error) {
      console.error('Error loading create post form:', error);
      res.status(500).render('error', {
        title: 'Server Error',
        message: 'Could not load create post form'
      });
    }
  }

  // CREATE A NEW POST (POST ROUTE)
  static async createPost(req, res) {
    try {
      // (You can optionally fetch tags again if needed, 
      //  but it's not strictly required for creating the post)
      const { user_id, description, media_url, tag_ids } = req.body;

      // Convert tag_ids from the request into an array of IDs (numbers)
      const selectedTagIds = Array.isArray(tag_ids)
        ? tag_ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
        : [];

      // Create the post using PostService
      const result = await PostService.createPost(
        user_id, 
        description, 
        media_url, 
        selectedTagIds
      );

      if (result.success) {
        // If successful, redirect to home (or wherever you want)
        res.redirect('/api/home');
      } else {
        // If not successful, display an error
        res.status(400).render('error', { 
          title: 'Error', 
          message: 'Failed to create post' 
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).render('error', { 
        title: 'Server Error', 
        message: 'Could not create post' 
      });
    }
  }

  // GET POST DETAILS (displays details for a specific post, including its comments)
  static async getPostDetails(req, res) {
    try {
      const postId = req.params.post_id;
      const post = await PostService.getPostById(postId);

      if (!post) {
        return res.status(404).render('error', {
          title: 'Post Not Found',
          message: `Post with ID ${postId} not found.`
        });
      }

      // Retrieve all comments for this post
      const comments = await CommentService.getByPostId(postId);

      // Render the post details page
      res.render('posts_details', { 
        title: 'Post Details', 
        post, 
        comments 
      });
    } catch (error) {
      res.status(500).render('error', {
        title: 'Server Error',
        message: error.message
      });
    }
  }

  // LISTING PAGE
  static async getAllPosts(req, res) {
    try {
      // Fetch all posts and tags
      const posts = await PostService.getAllPosts();
      const tags = await TagService.getAllTags();

      // Render the home page with the posts and tags
      res.render('Home', {
        title: 'Peerly - Home',
        posts,
        tags
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).render('error', {
        title: 'Server Error',
        message: 'Failed to load home page'
      });
    }
  }

  // DELETE A POST
  static async deletePost(req, res) {
    try {
      const postId = req.params.post_id;
      const result = await PostService.deletePost(postId);

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Post not found or already deleted.' 
        });
      }

      res.status(200).json({ 
        message: 'Post deleted successfully.' 
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  }
}

module.exports = PostController;
