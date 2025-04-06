// services/TagService.js

// Import the database pool to allow SQL queries.
const pool = require('../models/db');
// Import the Tag model (not directly used here but available if needed).
const Tag = require('../models/Tag');
// Import the formatDate utility to convert raw date values to a human-friendly format.
const formatDate = require('./utils/FormatDate.js');

class TagService {
  /**
   * Retrieves all tags from the database.
   * This method is typically used to build a filter ribbon for tags.
   *
   * @returns {Array} - An array of tag objects with tag_id and tag_name.
   */
  static async getAllTags() {
    // SQL query to select all tag IDs and tag names from the tags table.
    const sql = `SELECT tag_id, tag_name FROM tags`; 
    // Execute the query and destructure the returned rows.
    const [rows] = await pool.query(sql);
    // Return the list of tags.
    return rows;
  }

  /**
   * Retrieves posts that are associated with the given tag(s).
   *
   * @param {number|Array<number>} tags - A tag or an array of tags to filter posts by.
   * @returns {Array} - An array of posts that have the specified tag(s), each with user details.
   */
  static async getPostsByTags(tags) {
    // Ensure that tags is an array, even if a single tag is provided.
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    // Convert each tag to a number to avoid type issues in the query.
    tags = tags.map(tag => parseInt(tag));
    
    // Create a string of placeholders (e.g., "?, ?, ?") for use in the SQL query,
    // based on the number of tags provided.
    const placeholders = tags.map(() => '?').join(', ');
    
    // SQL query to join posts with users and post_tags, filtering by the specified tag IDs.
    // DISTINCT ensures that duplicate posts (if they have multiple matching tags) are returned only once.
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
    `;
    // Execute the query using the tag values.
    const [rows] = await pool.query(sql, tags);
    
    // Format the created_at date for each post, then return the posts.
    return rows.map(row => {
      row.created_at = formatDate(row.created_at);
      return row;
    });
  }
}

// Export the TagService class so it can be used elsewhere in the application.
module.exports = TagService;
