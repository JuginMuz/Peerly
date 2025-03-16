// models/Post.js
const pool = require('./db');

/**
 * The Post class represents a post made by a user on our platform.
 * It includes details about the post as well as some user info for convenience.
 */

class Post {
  constructor({
    post_id,
    user_id,
    description,
    media_url,
    created_at,
    first_name,
    last_name,
    profile_picture,
  }) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.description = description;
    this.media_url = media_url;
    this.created_at = created_at; 
    this.first_name = first_name;
    this.last_name = last_name;
    this.profile_picture = profile_picture;
  }
}

module.exports = Post;
