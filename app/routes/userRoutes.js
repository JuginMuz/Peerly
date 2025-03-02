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
router.get('/:id', async (req, res) => { //route to get specific user by id
    try {
        const sql = 'SELECT * FROM users WHERE user_id = ?'; // sql query that will select the whole list of users but
        //only return the first user that has the specified id. the sql query is also parameterized 
        //in order to prevent a sql injection 
        const user_id = req.params.id; // I had a issue here where i wrote user_id instead of id
        // but I found out that since express does not automatically extract parameters based on your query string variable names
        // i had to replace it with id instead 
        const [users] =  await db.query(sql, [user_id]); //calls db and runs a query with the sql and userid
        //however the user id is passed as a array becuase msql expects parameters in a array
        if (users.length === 0) { // basic valadation to find out if the query is looking for a user 
            //that does not exist
            console.log("User not found!"); // Log if the user isn't in the database
            return res.status(404).json({ error: "User not found" });
        }
        res.json(users[0]);
    }
    catch(err) {
        console.error("Query Failed:" , err.message);
        res.status(500).json({error: err.message })
    }

});
module.exports = router;