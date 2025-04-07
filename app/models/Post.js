// models/Post.js

const pool = require('./db'); // Import the database connection pool for potential database operations.

/**
 * The Post class models a user's post on our platform.
 * It holds information about the post as well as some user details.
 */
class Post {
  // The constructor takes an object with all necessary post details.
  constructor({
    post_id,         // Unique identifier for the post.
    user_id,         // Identifier of the user who created the post.
    description,     // Text content of the post.
    media_url,       // URL to any media attached to the post.
    created_at,      // Timestamp when the post was created.
    first_name,      // First name of the user who created the post.
    last_name,       // Last name of the user who created the post.
    profile_picture, // URL to the user's profile picture.
  }) {
    this.post_id = post_id;             // Assign the post ID.
    this.user_id = user_id;             // Assign the user ID.
    this.description = description;     // Assign the post's description.
    this.media_url = media_url;         // Assign the media URL.
    this.created_at = created_at;       // Assign the creation timestamp.
    this.first_name = first_name;       // Assign the user's first name.
    this.last_name = last_name;         // Assign the user's last name.
    this.profile_picture = profile_picture; // Assign the user's profile picture URL.
  }
}

module.exports = Post; // Export the Post class for use in other parts of the application.
