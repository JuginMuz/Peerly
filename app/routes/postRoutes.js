// Import Express framework to create and manage routes
const express = require("express");
// Creates a new Express Router instance to define routes separately
const router = express.Router();
// Imports the database service to interact with the database
const db = require("../services/db");

router.get("/" , async (req, res) => {
    try {
    const sql = 'SELECT * FROM posts';
    const [posts] = await db.query(sql);
    res.json(posts);
    } catch (err) {
        console.error("query failed",err.message);
        res.status(500).json({error: err.message});
    }
});
module.exports = router;