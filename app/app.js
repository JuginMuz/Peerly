//imports express framework
const express = require('express');
//imports path module in order to handle file and directory paths 
const path = require('path');
const app = express();
const PostService = require('./services/PostService');
const UserService = require('./services/UserService');
const TagService = require('./services/TagService');

// imports routes modules from the directory for which each route file
//handles specific end points for different paths of the app
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const tagRoutes = require('./routes/tagRoutes');
const homeRoutes = require('./routes/homeRoutes');
const accountRoutes = require('./routes/accountRoutes');
const UserController = require('./controllers/UserController');

//sets up the pug template
app.set('view engine', 'pug');
//specifies the dir where the pug are located
app.set('views', path.join(__dirname, 'views'));

// Parses JSON and URL-encoded data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uses static files (like CSS and images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// sets up the routes alongside there urls
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/', homeRoutes);
app.use('/user-account', accountRoutes);

app.get('/explore', async (req, res) => {
  try {
    const posts = await PostService.getAllPosts();
    res.render('explore', { 
      title: 'Peerly - Explore',
      posts: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).render('error', { 
      title: 'Server Error',
      message: 'Failed to load explore page'
    });
  }
});

app.get('/make-friends', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.render('make-friends', { 
      title: 'Peerly - Make-Friends',
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('error', { 
      title: 'Server Error',
      message: 'Failed to load find friends page page'
    });
  }
});

app.get('/user-account/:user_id', async (req, res) => {
    try {
        const {user_id} = req.params;  // Get userId from the URL
        const users = await UserService.findByUserId(user_id);  // Fetch user details
        if (!users) {
            return res.status(404).render('error', { 
                title: 'User Not Found',
                message: `User with ID ${user_id} not found.`
            });
        }
        res.render('user-account', { 
            title: 'Peerly - Account',
            users // Pass user data to Pug template
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).render('error', { 
            title: 'Server Error',
            message: 'Failed to load user account page'
        });
    }
});

app.get('/tags', async (req, res) => {
    try {
        let selectedTags = req.query.tags ? req.query.tags.split(',') : [];
        // Convert query string values to integers
        selectedTags = selectedTags.map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
        console.log("Selected Tags:", selectedTags); // Debugging step
        let posts = [];
        if (selectedTags.length > 0) {
            posts = await TagService.getPostsByTags(selectedTags); // Fetch posts by tag ID
            console.log("Fetched Posts:", posts);
        } else {
            posts = await PostService.getAllPosts();
        }
        const tags = await TagService.getAllTags();
        res.render('tags', { 
            title: 'Peerly - Tags',
            posts: posts,
            tags: tags
        });
    } catch (error) {
        console.error('Error fetching posts by tags:', error);
        res.status(500).render('error', { 
            title: 'Server Error',
            message: 'Failed to load tagged posts'
        });
    }
});

//sets port and starts the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Go to http://127.0.0.1:3000`);
});
