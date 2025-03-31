// services/PostService.js
const pool = require('../models/db');
const Post = require('../models/Post');
const formatDate = require('./utils/FormatDate.js');
class PostService {


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
  


  //LISTING PAGE
  static async getAllPosts() {
    const [rows] = await pool.query(`
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
      ORDER BY p.created_at DESC
    `);
    return rows.map(row => {
      row.created_at = formatDate(row.created_at);
      return row;
    });
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





      static async getPostsByUser(user_id) {
        const sql = `
          SELECT post_id, media_url, description, created_at
          FROM posts
          WHERE user_id = ?;
        `;
        const [rows] = await pool.query(sql, [user_id]);
        return rows;
      }
    }


module.exports = PostService;