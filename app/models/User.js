// models/User.js

// Import the database connection pool from the 'db' module.
// This can be used later for any database operations related to users.
const pool = require('./db');

// The User class models a user in our application.
// It holds all relevant user details, such as name, email, profile info, and more.
class User {
  // The constructor initializes a new User instance with properties provided as an object.
  constructor({
    user_seq,              // A sequential identifier for the user.
    user_id,               // A unique identifier for the user.
    first_name,            // The user's first name.
    last_name,             // The user's last name.
    email_id,              // The user's email address.
    profile_picture,       // URL/path to the user's profile picture.
    gender,                // The user's gender.
    bio,                   // A short biography or description of the user.
    field_id,              // An identifier for the user's field or area of expertise.
    dob,                   // The user's date of birth.
    city,                  // The city where the user lives.
    work_at,               // The workplace of the user.
    went_to,               // The educational institution the user attended.
    goes_to,               // The educational institution the user is currently attending.
    relationship_status    // The user's relationship status.
  }) {
    // Assign each property to the User instance.
    this.user_seq = user_seq;
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email_id = email_id;
    this.profile_picture = profile_picture;
    this.gender = gender;
    this.bio = bio;
    this.field_id = field_id;
    this.dob = dob;
    this.city = city;
    this.work_at = work_at;
    this.went_to = went_to;
    this.goes_to = goes_to;
    this.relationship_status = relationship_status;
  }
}

// Export the User class so it can be imported and used in other parts of the application.
module.exports = User;
