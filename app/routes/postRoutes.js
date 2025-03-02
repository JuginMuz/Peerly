// Import Express framework to create and manage routes
const express = require("express");
// Creates a new Express Router instance to define routes separately
const router = express.Router();
// Imports the database service to interact with the database
const db = require("../services/db");
//routes to list all posts and retrieve a specific post 
// for which commenting can be found on user routes file 
// as the routes here and there are the
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
router.get("/:id", async (req, res) => {
    try {
        const sql = 'SELECT * FROM posts WHERE post_id = ?';
        const post_id = req.params.id;
        const [post] = await db.query(sql, [post_id]);
        if(post.length === 0){
            console.log("No posts found");
            return res.status(404).json({error: 'No posts found'});
        }
        res.json(post[0]);
    }
    catch (err) {
        console.error("query failed:",err.message);
        return res.status(500).json({error: err.message});

    }

});
module.exports = router;