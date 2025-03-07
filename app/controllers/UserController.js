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
      const user = await UserService.findByUserId(req.params.user_id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ user });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }




  //USERS LISTING
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();  // This method should be implemented in your service.
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
