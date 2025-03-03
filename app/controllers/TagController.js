// controllers/TagController.js
const TagService = require('../services/TagService');

class TagController {
  static async createTag(req, res) {
    try {
      const tag = await TagService.createTag(req.body.tag_name);
      res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TagController;
