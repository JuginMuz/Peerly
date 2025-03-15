// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

// router.post('/', TagController.createTag);
router.get('/:tag_id', TagController.getPostsByTags);

module.exports = router;
