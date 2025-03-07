// models/User.js
const pool = require('./db');

class User {
  constructor({ user_seq, user_id, first_name, last_name, email_id, profile_picture, gender, bio, field_id, dob, city, work_at, went_to, goes_to, relationship_status }) {
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


  static async create(userData) {
    const sql = `
      INSERT INTO users 
      (first_name, last_name, email_id, profile_picture, gender, bio, field_id, dob, city, work_at, went_to, goes_to, relationship_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userData.first_name,
      userData.last_name,
      userData.email_id,
      userData.profile_picture,
      userData.gender,
      userData.bio,
      userData.field_id,
      userData.dob,
      userData.city,
      userData.work_at,
      userData.went_to,
      userData.goes_to,
      userData.relationship_status
    ];
    await pool.query(sql, values);
    // Retrieve the inserted user by email (or use LAST_INSERT_ID logic)
    const [rows] = await pool.query('SELECT first_name, last_name, email_id, profile_picture, gender, bio, field_id, dob, city, work_at, went_to, goes_to, relationship_status FROM users WHERE email_id = ?', [userData.email_id]);
    return rows.length ? new User(rows[0]) : null;
  }
}

module.exports = User;
