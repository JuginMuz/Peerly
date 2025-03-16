// models/Tag.js
const pool = require('./db');

class Tag {
  constructor({ tag_id, tag_name }) {
    this.tag_id = tag_id;
    this.tag_name = tag_name;
  }

  /* static async create(tagName) {
    const sql = 'INSERT INTO tags (tag_name) VALUES (?)';
    const [result] = await pool.query(sql, [tagName]);
    return this.findById(result.insertId);
  }
 */
  /*static async findById(tag_id) {
    const sql = 'SELECT * FROM tags WHERE tag_id = ?';
    const [rows] = await pool.query(sql, [tag_id]);
    return rows.length ? new Tag(rows[0]) : null;
  }*/
}

module.exports = Tag;
