// controllers/PostController.js

// Import the file system module to work with files (like renaming uploaded images).
const fs = require('fs');
// Import the path module to handle file and directory paths.
const path = require('path');
// Import the database connection pool to execute SQL queries directly when needed.
const pool = require('../models/db');
// Import services to handle business logic for comments, posts, and tags.
const CommentService = require('../services/CommentService');
const PostService = require('../services/PostService');
const TagService = require('../services/TagService');

class PostController {
  /**
   * Displays the form to create a new post.
   * Fetches all available tags for the filter ribbon and renders the create_post view.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async showCreateForm(req, res) {
    try {
      // Fetch all tags to display them as options (e.g., checkboxes) in the form.
      const availableTags = await TagService.getAllTags() || [];
      // Render the 'create_post' Pug template, passing the tags to the view.
      res.render('create_post', { tags: availableTags });
    } catch (error) {
      console.error('Error loading create post form:', error);
      // Render an error page with a 500 status if something goes wrong.
      res.status(500).render('error', {
        title: 'Server Error',
        message: 'Could not load create post form'
      });
    }
  }

  /**
   * Handles the creation of a new post.
   * Creates a post record, handles file renaming for uploaded media, and updates the post with the media URL.
   *
   * @param {object} req - The request object, containing user details, post data, and optionally an uploaded file.
   * @param {object} res - The response object.
   */
  static async createPost(req, res) {
    try {
      // Extract user_id, description, and tag_ids from the form data.
      const { user_id, description, tag_ids } = req.body;
      // If a file was uploaded, get its temporary filename; otherwise, set media_url_temp to null.
      const media_url_temp = req.file ? req.file.filename : null;

      // Create the post record without media_url for now.
      const result = await PostService.createPost(user_id, description, null, tag_ids);
      if (!result.success) {
        // If creation failed, return a 400 error.
        return res.status(400).send('Failed to create post');
      }
      // Retrieve the new post's ID from the service result.
      const post_id = result.post_id;

      // Initialize media_url as null. It will be updated if an image was uploaded.
      let media_url = null;
      if (media_url_temp) {
        // Extract the file extension from the temporary filename.
        const ext = path.extname(media_url_temp);
        // Construct a new filename using user_id and post_id.
        const newFilename = `${user_id}_${post_id}${ext}`;
        // Build the full paths for the old and new filenames.
        const oldPath = path.join(__dirname, '../public/images', media_url_temp);
        const newPath = path.join(__dirname, '../public/images', newFilename);
        // Rename the file from its temporary name to the new standardized name.
        fs.renameSync(oldPath, newPath);
        // Set the media_url to point to the new image location.
        media_url = '/images/' + newFilename;
        // Update the post record with the new media URL.
        await pool.query('UPDATE posts SET media_url = ? WHERE post_id = ?', [media_url, post_id]);
      }

      // Redirect the user to the home page after the post is created.
      res.redirect('/api/home');
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Server error');
    }
  }

  /**
   * Retrieves detailed information for a specific post.
   * Includes post details, associated comments, a list of posts, comment count, and like count.
   *
   * @param {object} req - The request object containing the post_id parameter.
   * @param {object} res - The response object used to render the view.
   */
  static async getPostDetails(req, res) {
    try {
      // Get the post ID from the request parameters.
      const postId = req.params.post_id;
      // Retrieve the post details using the PostService.
      const post = await PostService.getPostById(postId);

      // If the post does not exist, render a 404 error page.
      if (!post) {
        return res.status(404).render('error', {
          title: 'Post Not Found',
          message: `Post with ID ${postId} not found.`
        });
      }

      // Retrieve all comments for this post.
      const comments = await CommentService.getByPostId(postId);
      // Retrieve all posts to display (could be for a sidebar or related posts section).
      const posts = await PostService.getAllPosts();
      // Get the number of comments for this post.
      const commentcount = await CommentService.countComments(postId);
      // Get the number of likes for this post.
      const likecount = await PostService.countLikes(postId);
      
      // Render the 'posts_details' view with all the fetched data.
      res.render('posts_details', { 
        title: 'Post Details', 
        post, 
        comments, 
        posts,
        commentcount,
        likecount
      });
    } catch (error) {
      // In case of error, render the error page with the error message.
      res.status(500).render('error', {
        title: 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Retrieves and renders a list of all posts along with available tags.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object used to render the view.
   */
  static async getAllPosts(req, res) {
    try {
      // Fetch all posts using PostService.
      const posts = await PostService.getAllPosts();
      // Fetch all tags using TagService.
      const tags = await TagService.getAllTags();

      // Render the 'home' page, passing the posts and tags to the view.
      res.render('home', {
        title: 'Peerly - home',
        posts,
        tags
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Render an error page if fetching posts fails.
      res.status(500).render('error', {
        title: 'Server Error',
        message: 'Failed to load home page'
      });
    }
  }

  /**
   * Searches for posts based on a query string and renders the home page with results.
   *
   * @param {object} req - The request object, with query parameter 'q'.
   * @param {object} res - The response object used to render the view.
   */
  static async search(req, res) {
    try {
      // Get the search query from the URL query parameters.
      const query = req.query.q;
      // Retrieve matching posts using the PostService.
      const posts = await PostService.searchPosts(query);
      // Fetch available tags to display alongside search results.
      const tags = await TagService.getAllTags();

      // Render the 'home' page with the search results.
      res.render('home', {
        title: `Search Results for "${query}"`,
        query,
        posts,
        tags
      });
    } catch (error) {
      console.error('Search error:', error);
      // Render an error page if something goes wrong during the search.
      res.status(500).render('error', {
        title: 'Search Error',
        message: error.message
      });
    }
  }

  /**
   * Deletes a specific post and its associated records (like tags, likes, and comments).
   *
   * @param {object} req - The request object with parameters for user_id and post_id.
   * @param {object} res - The response object used for redirecting or sending error messages.
   */
  static async deletePost(req, res) {
    try {
      // Extract user_id and post_id from the URL parameters.
      const { user_id, post_id } = req.params;
      // Here you might add authorization checks to ensure the current user can delete the post.

      // Call the PostService to delete the post.
      const result = await PostService.deletePost(post_id, user_id);
      if (result.affectedRows > 0) {
        // If deletion is successful, redirect the user to their settings or a relevant page.
        res.redirect('/api/users/' + user_id + '/settings');
      } else {
        res.status(404).send('Post not found or could not be deleted.');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).send("Server error while deleting post.");
    }
  }

  /**
   * Toggles the like status for a specific post by the logged-in user.
   * Returns updated like count and the current like status.
   *
   * @param {object} req - The request object containing session and parameters.
   * @param {object} res - The response object used to return JSON data.
   */
  static async toggleLike(req, res) {
    try {
      // Get the user ID from the session; ensure the user is logged in.
      const userId = req.session.user_id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Get the post ID from the request parameters.
      const postId = req.params.post_id;

      // Toggle the like status using the PostService.
      await PostService.toggleLike(postId, userId);

      // Retrieve the updated like count directly from the database.
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?',
        [postId]
      );
      const likeCount = rows[0].likeCount;

      // Determine if the current user has liked the post.
      const likedByUser = await PostService.hasUserLiked(postId, userId);

      // Return the updated like count and like status as a JSON response.
      return res.json({ likeCount, likedByUser });
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = PostController;
