// controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {

  //REGISTER
  static async register(req, res) {
    try {
      const newUser = await UserService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  //LOGIN
  static async login(req, res) {
    try {
      const { email, plainTextPassword } = req.body;
      const user = await UserService.login(email, plainTextPassword);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }




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
  static async getProfile(req, res) {
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
  }




  //USERS LISTING
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.render('explore', { 
        title: 'Peerly - Make-Friends',
        users: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
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
