// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// router.post('/register', UserController.register);
// router.post('/login', UserController.login);
// router.patch('/:user_id', UserController.updateProfile);
// router.delete('/:user_id', UserController.deleteAccount);
router.get('/:user_id', UserController.getProfile);
router.get('/', UserController.getAllUsers);

module.exports = router;
