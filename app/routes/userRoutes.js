// Import Express framework to create and manage routes
const express = require("express");
// Creates a new Express Router instance to define routes separately
const router = express.Router();
// Imports the database service to interact with the database
const db = require("../services/db");

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM users';
        const [users] = await db.query(sql);  // Assuming db.query() returns a Promise
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch users" });
    }
});

module.exports = router;