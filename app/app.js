// imports express framework to create our server and handle routing
const express = require('express');
// imports the path module to work with file and directory paths
const path = require('path');
// creates an Express application instance
const app = express();

// Import the authentication routes
const authRoutes = require('./routes/authRoutes');
// Import session middleware to handle user sessions
const session = require('express-session');

// Set up session configuration
app.use(
  session({
    secret: 'my-very-secret-key', // Secret key for signing the session ID cookie (to be changed in production)
    resave: false,                // Avoids saving session if unmodified
    saveUninitialized: false,     // Don't create session until something stored
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session expires after 24 hours
  })
);

// Middleware to make session data available in all Pug templates
app.use((req, res, next) => {
  // Make user_id from session available as sessionUserId in templates; default to null if not present
  res.locals.sessionUserId = req.session.user_id || null;
  // Make profile_picture from session available as sessionProfilePic in templates; default to null if not present
  res.locals.sessionProfilePic = req.session.profile_picture || null;
  next();
});

// Import route modules for various parts of the application
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const LoginRoutes = require('./routes/authRoutes');
const tagRoutes = require('./routes/tagRoutes');
const homeRoutes = require('./routes/homeRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Set up Pug as the template engine
app.set('view engine', 'pug');
// Specify the directory where the Pug templates are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes with their respective URL prefixes
app.use('/api/users', userRoutes);
app.use('/api/home', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api', homeRoutes);
app.use('/api/auth', LoginRoutes);

// Catch 404 errors: if no route matches, create a "Page Not Found" error and pass it to the error handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler: logs the error and renders an error page with the error status and message
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs error stack for debugging
  res.status(err.status || 500);
  res.render('error', {
    message: 'Something went wrong',
    status: err.status || 500
  });
});

// Set the port for the server to listen on (default to 3000 if not specified in environment variables)
const PORT = process.env.PORT || 3000;
// Start the server and log a message indicating the port number and the sign-in URL for convenience
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Go to http://127.0.0.1:${PORT}/api/signin`);
});
