// Import Express framework to create and manage routes
const express = require("express");
// Creates a new Express Router instance to define routes separately
const router = express.Router();
// Imports the database service to interact with the database
const db = require("../services/db");

router.get('/', async (req, res) => { //route for getting all users which is asynchronous
    try {
        const sql = 'SELECT * FROM users'; //basic sql query
        const [users] = await db.query(sql);  // calls the database with a sql query 
        //but this will wait for the database to return the result before moving onto the next
        //line and thats done using await . what should be outputted is a array of users
        res.json(users); // this sends the list of users back to the client in json format
    } catch (err) { // then i have basic error handling that shows the specific error as 
        // I had trouble getting the database to work so i needed to know specifically
        console.error("Query Failed:", err.message);
        res.status(500).json({ error: err.message });  // Show real error
    }
});


module.exports = router;