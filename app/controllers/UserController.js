// controllers/UserController.js

// Import the UserService to handle user-related business logic.
const UserService = require('../services/UserService');
// Import the PostService to handle post-related operations.
const PostService = require('../services/PostService');
// Import the CommentService for comment-related functions.
const CommentService = require('../services/CommentService');
// Import the query function from our database model (if needed for direct queries).
const { query } = require('../models/db');

class UserController {
  /**
   * Updates a user's profile.
   * Retrieves the updated form data and, if a new profile picture was uploaded, adds its file path.
   * Finally, updates the database and redirects back to the settings page.
   *
   * @param {object} req - The request object with parameters and form data.
   * @param {object} res - The response object to send back the outcome.
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.params.user_id; // Get the user ID from the URL parameters.
      let updatedData = { ...req.body };   // Copy all form data into updatedData.

      // If a file was uploaded, set the profile_picture field.
      if (req.file) {
        // Build the relative path for the uploaded file.
        const filePath = '/images/' + req.file.filename;
        updatedData.profile_picture = filePath;
      }

      // Update the user's profile data in the database.
      await UserService.updateUserProfile(userId, updatedData);
      
      // Redirect back to the user's settings page.
      return res.redirect('/api/users/' + userId + '/settings');
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Retrieves a single user's profile along with their posts.
   * If the user is not found, it renders an error page.
   *
   * @param {object} req - The request object containing the user_id parameter.
   * @param {object} res - The response object used to render the view.
   */
  static async getProfile(req, res) {
    try {
      const user_id = req.params.user_id; // Get user ID from URL.
      
      // Fetch user details from the database.
      const userDetails = await UserService.findByUserId(user_id);
      
      // If the user doesn't exist, render a 404 error page.
      if (!userDetails) {
        return res.status(404).render('error', { 
          title: 'User Not Found', 
          message: `User with ID ${user_id} not found.`
        });
      }
      
      // Retrieve all posts made by the user.
      const userPosts = await PostService.getPostsByUser(user_id);
      
      // Attach the posts to the user details for display.
      userDetails.posts = userPosts;
      
      // Render the user account page with the fetched data.
      res.render('user-account', { title: 'Peerly - Account', user: userDetails });
    } catch (error) {
      console.error('Error in getAccountPage:', error);
      res.status(500).render('error', { 
        title: 'Server Error', 
        message: error.message 
      });
    }
  }

  /**
   * Retrieves and displays a list of all users.
   * Also fetches posts, possibly to provide additional context on the explore page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object to render the view.
   */
  static async getAllUsers(req, res) {
    try {
      // Get all users from the database.
      const users = await UserService.getAllUsers();
      // Also fetch posts to display alongside users.
      const posts = await PostService.getAllPosts();
      
      // Render the explore page where users can find friends.
      res.render('explore', { 
        title: 'Peerly - Make-Friends',
        users: users,
        posts: posts
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).render('error', { 
        title: 'Server Error', 
        message: error.message 
      });
    }
  }

  /**
   * Searches for users based on a query string.
   * Renders the explore page with the matching users.
   *
   * @param {object} req - The request object with the query parameter.
   * @param {object} res - The response object to render the view.
   */
  static async search(req, res) {
    try {
      const query = req.query.q; // Get the search term from query parameters.

      // If no search term is provided, render an error page.
      if (!query) {
        return res.status(400).render('error', {
          title: 'Missing Query',
          message: 'Please enter a search term.'
        });
      }

      // Search users using the UserService.
      const users = await UserService.searchUsers(query);
      // Also fetch posts to display alongside users.
      const posts = await PostService.getAllPosts();

      // Render the explore page with the search results.
      res.render('explore', { 
        title: `Search: ${query}`,
        users: users,
        posts
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).render('error', { 
        title: 'Server Error', 
        message: error.message 
      });
    }
  }

  /**
   * Renders the user settings page.
   * Fetches user data, available fields, posts by the user, and comments (if applicable).
   *
   * @param {object} req - The request object containing user_id and possibly post_id.
   * @param {object} res - The response object to render the settings view.
   */
  static async getSettingsPage(req, res) {
    try {
      const userId = req.params.user_id; // Get user ID from URL.
      const post_id = req.params.post_id; // May be used for comment counts.
      
      // Fetch user data from the database.
      const userData = await UserService.findByUserId(userId);
      // Fetch available fields (e.g., fields of study) for the settings form.
      const fields = await UserService.getAllFields();
      
      // If no user data is found, render a 404 error page.
      if (!userData) {
        return res.status(404).render('error', {
          title: 'User Not Found',
          message: `User with ID ${userId} not found.`
        });
      }

      // Get all posts made by the user.
      const posts = await PostService.getPostsByUser(userId);
      // Get comment count for a particular post (if provided).
      const comments = await CommentService.countComments(post_id);
      
      // Render the settings page with user data, available fields, posts, and comment count.
      res.render('user-settings', { user: userData, fields, posts, comments });
    } catch (error) {
      console.error('Error in getSettingsPage:', error);
      res.status(500).render('error', {
        title: 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Deletes a user account along with all associated data.
   * After deletion, redirects the user to the login page.
   *
   * @param {object} req - The request object containing the user_id parameter.
   * @param {object} res - The response object to send back the outcome.
   */
  static async deleteAccount(req, res) {
    try {
      const userId = req.params.user_id; // Get user ID from URL.
      // Call the UserService to delete the user's account.
      const result = await UserService.deleteUserAccount(userId);
      
      // If no records were affected, the user was not found.
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found or already deleted.' });
      }
      
      // Redirect to the login page after successful deletion.
      return res.redirect('/api/login');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the UserController so it can be used in route definitions.
module.exports = UserController;
