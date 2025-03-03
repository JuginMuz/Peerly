// controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {
  static async register(req, res) {
    try {
      const newUser = await UserService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, plainTextPassword } = req.body;
      const user = await UserService.login(email, plainTextPassword);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserService.getUserProfile(req.params.user_id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ user });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();  // This method should be implemented in your service.
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
