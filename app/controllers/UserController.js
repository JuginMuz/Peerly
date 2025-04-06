// controllers/UserController.js
const UserService = require('../services/UserService');
const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const { query } = require('../models/db');


class UserController {

  
  // UPDATE PROFILE
  static async updateProfile(req, res) {
    try {
      const userId = req.params.user_id;
      // Get form fields from req.body
      let updatedData = { ...req.body };
  
      // Check if a profile picture file was uploaded
      if (req.file) {
        // Build the relative file path (assuming your public folder is served)
        const filePath = '/images/' + req.file.filename;
        // Include the profile picture in the update data
        updatedData.profile_picture = filePath;
      }
  
      // Update the user profile in the database
      await UserService.updateUserProfile(userId, updatedData);
      
      // Optionally, fetch updated user data if needed:
      // const updatedUser = await UserService.findByUserId(userId);
      
      // Redirect back to the settings page (or any page you prefer)
      return res.redirect('/api/users/' + userId + '/settings');
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: error.message });
    }
  }
  




// Retrieves a single user's profile along with their posts
static async getProfile(req, res) {
  try {
    // Gets the user ID from the request parameters
    const user_id = req.params.user_id;
    
    // Fetchs user details from the database using the UserService
    const userDetails = await UserService.findByUserId(user_id);
    
    // If no user is found, show a 404 page with a friendly message
    if (!userDetails) {
      return res.status(404).render('error', { 
        title: 'User Not Found', 
        message: `User with ID ${user_id} not found.`
      });
    }
    
    // Gets all posts made by this user
    const userPosts = await PostService.getPostsByUser(user_id);
    
    // Attachs the posts to the user's details so we can show everything on one page
    userDetails.posts = userPosts;
    
    // Renders the user account page with all the details we just fetched
    res.render('user-account', { title: 'Peerly - Account', user: userDetails });
  } catch (error) {
    // Logs any errors and show a 500 error page with the error message
    console.error('Error in getAccountPage:', error);
    res.status(500).render('error', { 
      title: 'Server Error', 
      message: error.message 
    });
  }
}

// Fetches and displays a list of all users
static async getAllUsers(req, res) {
  try {
    // Retrieves all users from the database
    const users = await UserService.getAllUsers();
    const posts = await PostService.getAllPosts();
    
    // Renders the explore page to display the list of users for making friends
    res.render('explore', { 
      title: 'Peerly - Make-Friends',
      users: users,
      posts: posts

    });
  } catch (error) {
    // If something goes wrong, log the error and render an error page
    console.error('Error fetching users:', error);
    res.status(500).render('error', { 
      title: 'Server Error', 
      message: error.message 
    });
  }
}

static async search(req, res) {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).render('error', {
        title: 'Missing Query',
        message: 'Please enter a search term.'
      });
    }

    const users = await UserService.searchUsers(query);

    res.render('explore', { 
      title: `Search: ${query}`,
      users: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).render('error', { 
      title: 'Server Error', 
      message: error.message 
    });
  }
}


static async getSettingsPage(req, res) {
  try {
    const userId = req.params.user_id;
    const post_id = req.params.post_id;
    // Fetch user data from the DB
   
    const userData = await UserService.findByUserId(userId);
    const fields = await UserService.getAllFields(); // Or however you fetch available fields
    

    if (!userData) {
      return res.status(404).render('error', {
        title: 'User Not Found',
        message: `User with ID ${userId} not found.`
      });
    }

    const posts = await PostService.getPostsByUser(userId);
    const comments = await CommentService.countComments(post_id);
    // Render the Pug template for user settings
    // Pass the user object so Pug can prefill the form fields
    res.render('user-settings', { user: userData, fields, posts, comments });
  } catch (error) {
    console.error('Error in getSettingsPage:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: error.message
    });
  }
}



  //DELETE ACCOUNT
  static async deleteAccount(req, res) {
    try {
      const userId = req.params.user_id;
      const result = await UserService.deleteUserAccount(userId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found or already deleted.' });
      }
      
      return res.redirect('/api/login');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 

}
module.exports = UserController;
