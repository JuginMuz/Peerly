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
      const posts = await PostService.getAllPosts();
      const commentcount = await CommentService.countComments(postId);
      const likecount = await PostService.countLikes(postId);
      
      // Render the post details page
      res.render('posts_details', { 
        title: 'Post Details', 
        post, 
        comments, 
        posts,
        commentcount,
        likecount
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
    const { user_id, post_id } = req.params;
    // You might want to add authorization checks here
    // For example: if (req.session.userId !== user_id) { return res.status(403).send("Not allowed"); }

    const result = await PostService.deletePost(post_id, user_id);
    if (result.affectedRows > 0) {
      res.redirect('/api/users/' + user_id + '/settings'); // Or wherever you want to redirect after deletion
    } else {
      res.status(404).send('Post not found or could not be deleted.');
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Server error while deleting post.");
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
