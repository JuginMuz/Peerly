// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');
// router.post('/register', UserController.register);
// router.post('/login', UserController.login);
// router.patch('/:user_id', UserController.updateProfile);
// router.delete('/:user_id', UserController.deleteAccount);
router.get('/:user_id/settings', UserController.getSettingsPage);
router.get('/:user_id', UserController.getProfile);
router.get('/', UserController.getAllUsers);
// routes for settings page functionality
router.post('/:user_id/updateProfile', UserController.updateProfile);
router.post('/:user_id/deleteAccount', UserController.deleteAccount);
router.post('/:user_id/deletePost/:post_id', PostController.deletePost);

router.get('/:user_id', UserController.getProfile);
router.get('/', UserController.getAllUsers);
router.get('/search/byword', UserController.search);



module.exports = router;
