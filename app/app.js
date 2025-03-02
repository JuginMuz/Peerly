// Import express.js
const express = require("express");

// Imports path so I can safely build and resolve file/directory paths
// which is useful as im serving static files
const path = require("path");

// Import routes as modules
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// Create express app
const app = express();

// created to serve static files like (CSS, JS, images) from the "static" folder
// using a path-safe approach:
//app.use(express.static(path.join(__dirname, "static")));

// Gets the functions in the db.js file to use
const db = require("./services/db");

//over here I mount the user routes onto a specific path with the path being /users
//this simplifies to use this router for any requests that start with this path
app.use("/users", userRoutes);
app.use("/posts",postRoutes)



// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
