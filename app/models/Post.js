// models/Post.js
const pool = require('./db');

class Post {
  constructor({
    post_id,
    user_id,
    description,
    media_url,
    created_at,
  }) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.description = description;
    this.media_url = media_url;
    this.created_at = created_at; 
  }
}

module.exports = Post;
