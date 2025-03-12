// services/PostService.js
const pool = require('../models/db');
const Post = require('../models/Post');

class PostService {

  //ADD POST
  /* static async createPost(postData) {
    // postData should include:
    // - user_id: the ID of the post's author
    // - description: post content
    // - media_url: (optional) URL for any media
    // - tags: an array of tag IDs (selected from a dropdown list on the frontend)
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the post into the posts table.
      const postSql = 'INSERT INTO posts (user_id, description, media_url) VALUES (?, ?, ?)';
      const [postResult] = await connection.query(postSql, [
        postData.user_id,
        postData.description,
        postData.media_url
      ]);
      const postId = postResult.insertId;

      // If tags are provided, insert relationships into post_tags.
      if (postData.tags && Array.isArray(postData.tags) && postData.tags.length > 0) {
        for (const tagId of postData.tags) {
          const tagSql = 'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)';
          await connection.query(tagSql, [postId, tagId]);
        }
      }

      await connection.commit();

      // Retrieve and return the newly created post.
      return await Post.findById(postId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } */



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
    return rows.length ? new Post(rows[0]) : null;
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
        u.last_name
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }


  //DELETE A POST
  /* static async deletePost(post_id) {
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
  } */




  /* static async getPostsByTags(tags) {
    // Ensure tags is an array
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    // Create placeholders for the query based on the number of tags
    const placeholders = tags.map(() => '?').join(', ');
    // Query: join posts with users to get user's first_name and last_name
    const sql = `
      SELECT DISTINCT 
        u.first_name, 
        u.last_name, 
        p.media_url, 
        p.description, 
        p.created_at
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      JOIN post_tags pt ON p.post_id = pt.post_id
      WHERE pt.tag_id IN (${placeholders})
    `;
    const [rows] = await pool.query(sql, tags);
    return rows;
  } */

      static async getPostsByUser(user_id) {
        const sql = `
          SELECT media_url, description, created_at
          FROM posts
          WHERE user_id = ?;
        `;
        const [rows] = await pool.query(sql, [user_id]);
        return rows;
      }
    }


module.exports = PostService;