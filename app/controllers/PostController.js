// controllers/PostController.js
const fs = require('fs');
const path = require('path');  // Import path module
const pool = require('../models/db');  // Add this line to import pool
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
  /*static async createPost(req, res) {
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
  }*/

  static async createPost(req, res) {
    try {
      const { user_id, description, tag_ids } = req.body;
      // The uploaded file is available in req.file (if any)
      const media_url_temp = req.file ? req.file.filename : null;

      // Create the post without the media_url first
      const result = await PostService.createPost(user_id, description, null, tag_ids);
      if (!result.success) {
        return res.status(400).send('Failed to create post');
      }
      const post_id = result.post_id;

      let media_url = null;
      if (media_url_temp) {
        // Build the new filename: <user_id>_<post_id><extension>
        const ext = path.extname(media_url_temp);
        const newFilename = `${user_id}_${post_id}${ext}`;
        const oldPath = path.join(__dirname, '../public/images', media_url_temp);
        const newPath = path.join(__dirname, '../public/images', newFilename);
        // Rename the file
        fs.renameSync(oldPath, newPath);
        media_url = '/images/' + newFilename;
        // Update the post record with the media_url
        await pool.query('UPDATE posts SET media_url = ? WHERE post_id = ?', [media_url, post_id]);
      }

      res.redirect('/api/home');
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Server error');
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
      res.render('home', {
        title: 'Peerly - home',
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

  static async search(req, res) {
    try {
      const query = req.query.q;
  
      const posts = await PostService.searchPosts(query);
      const tags = await TagService.getAllTags(); // 👈 fetch tags

      
  
      res.render('home', {
        title: `Search Results for "${query}"`,
        query,
        posts,
        tags, // 👈 pass it to the view
      });
      
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).render('error', {
        title: 'Search Error',
        message: error.message
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


   // Toggle like for a post
  static async toggleLike(req, res) {
    try {
      const userId = req.session.user_id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const postId = req.params.post_id;

      // Toggle the like status using PostService
      await PostService.toggleLike(postId, userId);

      // Retrieve the updated like count
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?',
        [postId]
      );
      const likeCount = rows[0].likeCount;

      // Determine the current like status
      const likedByUser = await PostService.hasUserLiked(postId, userId);

      // Return the updated data as JSON
      return res.json({ likeCount, likedByUser });
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }


}

module.exports = PostController;
