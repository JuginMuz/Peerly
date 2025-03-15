// services/TagService.js
const pool = require('../models/db');
const Tag = require('../models/Tag');
const formatDate = require('./utils/FormatDate.js');

class TagService {

  // Get All Tags for filter ribbon
  static async getAllTags() {
    const sql = `SELECT tag_id, tag_name FROM tags`; // Adjust table name if needed
    const [rows] = await pool.query(sql);
    return rows;
  }

 

  // Get posts associated to specific tags
  static async getPostsByTags(tags) {
    // Ensure tags is an array
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    tags = tags.map(tag => parseInt(tag)); // Convert to numbers
    // Create placeholders for the query based on the number of tags
    const placeholders = tags.map(() => '?').join(', ');
    // Query: join posts with users to get user's first_name and last_name
    const sql = `
      SELECT DISTINCT 
        p.post_id,
        p.description,
        p.media_url,
        p.created_at,
        u.user_id,
        u.first_name,
        u.last_name,
        u.profile_picture
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      JOIN post_tags pt ON p.post_id = pt.post_id
      WHERE pt.tag_id IN (${placeholders})
    `
    const [rows] = await pool.query(sql, tags);
    return rows.map(row => {
          row.created_at = formatDate(row.created_at);
          return row;
        });
  } 
}

module.exports = TagService;
