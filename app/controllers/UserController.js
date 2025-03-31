// controllers/UserController.js
const UserService = require('../services/UserService');
const PostService = require('../services/PostService');
const Authentication = require('../models/Authentication');


class UserController {

  //REGISTER
  static async register(req, res) {
    try {
    await UserService.register(req.body);
    // Redirects to login after successful registration
    return res.redirect('/api/login');
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).send("Server error during registration");
  }
};




  //Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Finds the user by email
      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(401).send('Invalid email or password.');
      }
  
      // Verify's password
      const validPassword = await Authentication.verifyPassword(user.user_id, password);
      if (!validPassword) {
        return res.status(401).send('Invalid email or password.');
      }
  
      // If valid, stores user info in the session
      req.session.userId = user.user_id; // user_id from the DB
      req.session.email = user.email_id;  // for quick reference
  
      //Redirects to home page
      return res.redirect('/api/home');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  };



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



  //DELETE ACCOUNT
  /* static async deleteAccount(req, res) {
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
  } */
}

module.exports = UserController;
