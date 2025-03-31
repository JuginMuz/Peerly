// models/Tag.js
const pool = require('./db');

class Tag {
  constructor({ tag_id, tag_name }) {
    this.tag_id = tag_id;
    this.tag_name = tag_name;
  }
}

module.exports = Tag;
