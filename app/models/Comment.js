// models/Comment.js

// Import the database pool from the 'db' module.
// This pool is used to interact with the database by executing SQL queries.
const pool = require('./db');

// The Comment class models a comment made on a post.
// It encapsulates properties like the comment's ID, the ID of the user who made it,
// the post ID where the comment was made, the comment text, and timestamps for creation and updates.
class Comment {
  // The constructor initializes a new Comment instance with the given properties.
  // It expects an object containing comment_id, user_id, post_id, description, created_at, and updated_at.
  constructor({ comment_id, user_id, post_id, description, created_at, updated_at }) {
    // Assign the provided comment ID to the instance.
    this.comment_id = comment_id;
    // Assign the user ID to the instance.
    this.user_id = user_id;
    // Assign the post ID to the instance.
    this.post_id = post_id;
    // Assign the comment text (description) to the instance.
    this.description = description;
    // Assign the timestamp when the comment was created.
    this.created_at = created_at;
    // Assign the timestamp when the comment was last updated.
    this.updated_at = updated_at;
  }

 
}

// Export the Comment class so it can be used in other parts of the application.
module.exports = Comment;
