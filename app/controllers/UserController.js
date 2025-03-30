// controllers/UserController.js
const UserService = require('../services/UserService');
const PostService = require('../services/PostService');


class UserController {

  //REGISTER
  /* static async register(req, res) {
    try {
      const newUser = await UserService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
 */

  //LOGIN
  /* static async login(req, res) {
    try {
      const { email, plainTextPassword } = req.body;
      const user = await UserService.login(email, plainTextPassword);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  } */




  //UPDATE PROFILE
  static async updateProfile(req, res) {
    try {
      const userId = req.params.user_id;
      const updatedData = req.body; // The fields to update (e.g., first_name, bio, etc.)

      const result = await UserService.updateUserProfile(userId, updatedData);
      res.status(200).json({ 
        message: 'Profile updated successfully', 
        updatedUser 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 




  //GET PROFILE
  /* static async getProfile(req, res) {
    try {
      const { user_id } = req.params; // Get userId from the URL
      const user = await UserService.findByUserId(user_id); // Fetch user details
      if (!user) {
        return res.status(404).render('error', { 
          title: 'User Not Found',
          message: `User with ID ${user_id} not found.`
        });
      }
      res.render('user-account', { 
        title: 'Peerly - Account',
        user // Pass user data to Pug template
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    
    }
  } */



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
    
    // Renders the explore page to display the list of users for making friends
    res.render('explore', { 
      title: 'Peerly - Make-Friends',
      users: users
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
static async getSettingsPage(req, res) {
  try {
    const userId = req.params.user_id;
    // Fetch user data from the DB
    const userData = await UserService.findByUserId(userId);

    if (!userData) {
      return res.status(404).render('error', {
        title: 'User Not Found',
        message: `User with ID ${userId} not found.`
      });
    }

    // Render the Pug template for user settings
    // Pass the user object so Pug can prefill the form fields
    res.render('user-settings', { user: userData });
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
      
      res.status(200).json({ message: 'Account and related records deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 

}
module.exports = UserController;
