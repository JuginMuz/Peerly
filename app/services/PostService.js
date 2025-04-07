// services/PostService.js

// Import the database pool to run SQL queries.
const pool = require('../models/db');
// Import the Post model to create post instances from query results.
const Post = require('../models/Post');
// Import the formatDate utility to format date strings in a readable format.
const formatDate = require('./utils/FormatDate.js');

class PostService {
  /**
   * Creates a new post and associates it with given tag IDs.
   * Validates that at least one tag is provided.
   *
   * @param {number} user_id - The ID of the user creating the post.
   * @param {string} description - The text description of the post.
   * @param {string} media_url - The URL for the post's media (if any).
   * @param {number|array} tag_ids - One or more tag IDs to associate with the post.
   * @returns {object} - An object indicating success/failure and the post ID if successful.
   */
  static async createPost(user_id, description, media_url, tag_ids) {
    // Check that tag_ids is provided and not empty.
    if (!tag_ids || (Array.isArray(tag_ids) && tag_ids.length === 0)) {
      return { success: false, message: "At least one tag is required." };
    }
  
    // Convert tag_ids to an array of numbers (handle both single value and array case).
    const selectedTagIds = Array.isArray(tag_ids)
      ? tag_ids.map(id => parseInt(id, 10))
      : [parseInt(tag_ids, 10)];
  
    // Get a connection from the pool to start a transaction.
    const connection = await pool.getConnection();
    try {
      // Begin a transaction to ensure all queries execute successfully together.
      await connection.beginTransaction();
  
      // Insert a new post into the 'posts' table.
      const postQuery = `INSERT INTO posts (user_id, description, media_url) VALUES (?, ?, ?)`;
      const [postResult] = await connection.query(postQuery, [user_id, description, media_url]);
      // Get the newly created post ID.
      const post_id = postResult.insertId;
  
      // If there are tags to associate, insert records into the 'post_tags' table.
      if (selectedTagIds.length > 0) {
        const tagQuery = `INSERT INTO post_tags (post_id, tag_id) VALUES ?`;
        // Prepare an array of values where each element is a tuple [post_id, tag_id].
        const tagValues = selectedTagIds.map(tag_id => [post_id, tag_id]);
        await connection.query(tagQuery, [tagValues]);
      }
  
      // Commit the transaction after successful insertion.
      await connection.commit();
      return { success: true, message: 'Post created successfully', post_id };
    } catch (error) {
      // Rollback the transaction if an error occurs.
      await connection.rollback();
      console.error("Error creating post:", error);
      return { success: false, message: 'Failed to create post' };
    } finally {
      // Always release the connection back to the pool.
      connection.release();
    }
  }

  /**
   * Retrieves a single post by its ID along with user details.
   *
   * @param {number} post_id - The ID of the post to retrieve.
   * @returns {Post|null} - A Post instance if found, or null if not.
   */
  static async getPostById(post_id) {
    // SQL query to select post details along with user information.
    const sql = `
      SELECT 
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
      WHERE p.post_id = ?
    `;
    const [rows] = await pool.query(sql, [post_id]);
    if (rows.length) {
      // Format the creation date of the post.
      rows[0].created_at = formatDate(rows[0].created_at);
      // Return a new Post instance constructed from the row data.
      return new Post(rows[0]);
    }
    // Return null if no post is found.
    return null;
  }
  
  /**
   * Counts the total number of likes for a given post.
   *
   * @param {number} post_id - The ID of the post.
   * @returns {number} - The count of likes.
   */
  static async countLikes(post_id) {
    const sql = `
      SELECT COUNT(*) AS likeCount
      FROM likes
      WHERE post_id = ?
    `;
    const [rows] = await pool.query(sql, [post_id]);
    return rows[0].likeCount;
  }
  
  /**
   * Retrieves all posts with their details and like status for a given user.
   *
   * @param {number} userId - The ID of the user for whom to check like status.
   * @returns {Array} - An array of posts with additional fields like formatted date, like count, and whether the user liked the post.
   */
  static async getAllPosts(userId) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.post_id,
        p.description,
        p.media_url,
        p.created_at,
        u.user_id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) AS likeCount,
        COUNT(l.user_id) AS userLiked
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN likes l ON l.post_id = p.post_id AND l.user_id = ?
      GROUP BY p.post_id, p.description, p.media_url, p.created_at, u.user_id, u.first_name, u.last_name, u.profile_picture
      ORDER BY p.created_at DESC
      `,
      [userId]
    );
  
    // Map over each row to format the date and determine if the user liked the post.
    return rows.map(row => ({
      ...row,
      created_at: formatDate(row.created_at),
      likeCount: row.likeCount || 0,
      likedByUser: row.userLiked > 0
    }));
  }
  
  /**
   * Deletes a post and its associated data (tags, likes, comments) in a transaction.
   *
   * @param {number} post_id - The ID of the post to delete.
   * @returns {object} - The result of the delete operation.
   */
  static async deletePost(post_id) {
    const connection = await pool.getConnection();
    try {
      // Start transaction to ensure all deletions occur together.
      await connection.beginTransaction();

      // Delete associations in the post_tags table.
      await connection.query('DELETE FROM post_tags WHERE post_id = ?', [post_id]);

      // Delete related likes.
      await connection.query('DELETE FROM likes WHERE post_id = ?', [post_id]);

      // Delete associated comments.
      await connection.query('DELETE FROM comments WHERE post_id = ?', [post_id]);

      // Finally, delete the post itself from the posts table.
      const [result] = await connection.query('DELETE FROM posts WHERE post_id = ?', [post_id]);

      // Commit the transaction after successful deletion.
      await connection.commit();
      return result;
    } catch (error) {
      // Roll back the transaction if any step fails.
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool.
      connection.release();
    }
  } 

  /**
   * Retrieves all posts created by a specific user.
   * If currentUserId is provided, also returns whether that user has liked each post.
   *
   * @param {number} user_id - The ID of the user whose posts to retrieve.
   * @param {number|null} currentUserId - The ID of the user checking like status (optional).
   * @returns {Array} - An array of posts with extra details including formatted date and like status.
   */
  static async getPostsByUser(user_id, currentUserId = null) {
    let sql, params;
    
    // If currentUserId is provided, include the like status for that user.
    if (currentUserId) {
      sql = `
        SELECT 
          p.user_id,
          p.post_id,
          p.description,
          p.media_url,
          p.created_at,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) AS likeCount,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS commentCount,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id AND user_id = ?) AS userLiked
        FROM posts p
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `;
      params = [currentUserId, user_id];
    } else {
      // Otherwise, just get the post details without checking for user like status.
      sql = `
        SELECT 
          p.user_id,
          p.post_id,
          p.description,
          p.media_url,
          p.created_at,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) AS likeCount,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS commentCount
        FROM posts p
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `;
      params = [user_id];
    }
    
    const [rows] = await pool.query(sql, params);
    
    // Map each post to include formatted date and a boolean indicating if the current user liked it.
    return rows.map(row => ({
      ...row,
      created_at: formatDate(row.created_at),
      likedByUser: currentUserId ? row.userLiked > 0 : false
    }));
  }
  
  /**
   * Searches for posts where the description or user name matches the query.
   *
   * @param {string} query - The search term to look for in posts and user names.
   * @returns {Array} - An array of matching posts with formatted dates and like count.
   */
  static async searchPosts(query) {
    const [rows] = await pool.query(`
      SELECT 
        p.post_id,
        p.description,
        p.media_url,
        p.created_at,
        u.user_id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) AS likeCount
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      WHERE 
        p.description LIKE ? OR 
        u.first_name LIKE ? OR 
        u.last_name LIKE ?
      ORDER BY p.created_at DESC
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    
    // Format the created_at field for each matching post.
    return rows.map(row => {
      row.created_at = formatDate(row.created_at);
      return row;
    });
  }

  /**
   * Checks if a specific user has liked a specific post.
   *
   * @param {number} postId - The ID of the post.
   * @param {number} userId - The ID of the user.
   * @returns {boolean} - True if the user has liked the post, otherwise false.
   */
  static async hasUserLiked(postId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    return rows.length > 0;
  }

  /**
   * Adds a like record for a given post and user.
   *
   * @param {number} postId - The ID of the post to like.
   * @param {number} userId - The ID of the user liking the post.
   */
  static async addLike(postId, userId) {
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
  }

  /**
   * Removes a like record for a given post and user.
   *
   * @param {number} postId - The ID of the post.
   * @param {number} userId - The ID of the user.
   */
  static async removeLike(postId, userId) {
    await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
  }

  /**
   * Toggles the like status for a given post and user.
   * If the post is already liked by the user, the like is removed; otherwise, a like is added.
   *
   * @param {number} postId - The ID of the post.
   * @param {number} userId - The ID of the user.
   * @returns {boolean} - The new like status (true if liked, false if unliked).
   */
  static async toggleLike(postId, userId) {
    const liked = await this.hasUserLiked(postId, userId);
    if (liked) {
      await this.removeLike(postId, userId);
    } else {
      await this.addLike(postId, userId);
    }
    // Return the opposite of the previous status to indicate the new state.
    return !liked;
  }
}

module.exports = PostService;
