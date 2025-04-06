// services/PostService.js
const pool = require('../models/db');
const Post = require('../models/Post');
const formatDate = require('./utils/FormatDate.js');
class PostService {


  static async createPost(user_id, description, media_url, tag_ids) {
    // Ensure that tag_ids is provided and is not empty
    if (!tag_ids || (Array.isArray(tag_ids) && tag_ids.length === 0)) {
      return { success: false, message: "At least one tag is required." };
    }
  
    // Convert tag_ids to an array of numbers, whether it's already an array or a single value
    const selectedTagIds = Array.isArray(tag_ids)
      ? tag_ids.map(id => parseInt(id, 10))
      : [parseInt(tag_ids, 10)];
  
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Insert the new post
      const postQuery = `INSERT INTO posts (user_id, description, media_url) VALUES (?, ?, ?)`;
      const [postResult] = await connection.query(postQuery, [user_id, description, media_url]);
      const post_id = postResult.insertId;
  
      // Associate the post with the selected tags
      if (selectedTagIds.length > 0) {
        const tagQuery = `INSERT INTO post_tags (post_id, tag_id) VALUES ?`;
        const tagValues = selectedTagIds.map(tag_id => [post_id, tag_id]);
        await connection.query(tagQuery, [tagValues]);
      }
  
      await connection.commit();
      return { success: true, message: 'Post created successfully', post_id };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating post:", error);
      return { success: false, message: 'Failed to create post' };
    } finally {
      connection.release();
    }
  }
  

  //GET POST
  static async getPostById(post_id) {
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
      // Format the created_at for the single post row
      rows[0].created_at = formatDate(rows[0].created_at);
      return new Post(rows[0]);
    }

    return null;
  }
  
  static async countLikes(post_id) {
    const sql = `
      SELECT COUNT(*) AS likeCount
      FROM likes
      WHERE post_id = ?
    `;
    const [rows] = await pool.query(sql, [post_id]);
    return rows[0].likeCount;
  }
  
  

  //LISTING PAGE
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
  
    return rows.map(row => ({
      ...row,
      created_at: formatDate(row.created_at),
      likeCount: row.likeCount || 0,
      likedByUser: row.userLiked > 0
    }));

  }
  
  

  //DELETE A POST
   static async deletePost(post_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete related records from post_tags table
      await connection.query('DELETE FROM post_tags WHERE post_id = ?', [post_id]);

      // Delete related records from likes table
      await connection.query('DELETE FROM likes WHERE post_id = ?', [post_id]);

      // Delete related records from comments table
      await connection.query('DELETE FROM comments WHERE post_id = ?', [post_id]);

      // Finally, delete the post from posts table
      const [result] = await connection.query('DELETE FROM posts WHERE post_id = ?', [post_id]);

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } 





  static async getPostsByUser(user_id, currentUserId = null) {
    let sql, params;
    
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
    
    return rows.map(row => ({
      ...row,
      created_at: formatDate(row.created_at),
      likedByUser: currentUserId ? row.userLiked > 0 : false
    }));
  }
  



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
      
        return rows.map(row => {
          row.created_at = formatDate(row.created_at);
          return row;
          
        });
      }


       // Checks if a user has liked a post
  static async hasUserLiked(postId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    return rows.length > 0;
  }

  // Adds a like record
  static async addLike(postId, userId) {
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
  }

  // Removes a like record
  static async removeLike(postId, userId) {
    await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
  }

  // Toggles the like status: if already liked, remove the like; if not, add the like.
  static async toggleLike(postId, userId) {
    const liked = await this.hasUserLiked(postId, userId);
    if (liked) {
      await this.removeLike(postId, userId);
    } else {
      await this.addLike(postId, userId);
    }
    return !liked; // returns the new like status (true if now liked)
  }

      
      
    }


module.exports = PostService;