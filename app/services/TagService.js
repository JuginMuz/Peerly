// services/TagService.js
const pool = require('../models/db');
const Tag = require('../models/Tag');

class TagService {
  static async createTag(tagName) {
    return Tag.create(tagName);
  }

  // Additional methods like getAllTags can be added here.
}

module.exports = TagService;
