// models/Tag.js

const pool = require('./db'); // Import the database pool, which could be used for future operations related to tags.

class Tag {
  // Initialize a new Tag instance with tag ID and tag name.
  constructor({ tag_id, tag_name }) {
    this.tag_id = tag_id;     // Set the unique identifier for the tag.
    this.tag_name = tag_name; // Set the name of the tag.
  }
}

module.exports = Tag; // Export the Tag class for use in other parts of the application.
