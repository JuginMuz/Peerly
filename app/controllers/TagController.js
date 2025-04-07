// controllers/TagController.js

// Import the TagService to handle business logic related to tags.
const TagService = require('../services/TagService');
const PostService = require('../services/PostService');

class TagController {
  /**
   * Retrieves posts based on selected tags and renders the home page.
   * The method extracts tag information from the query string, converts them to numbers,
   * fetches matching posts using the TagService, retrieves all tags for display,
   * and finally renders the home page with the data.
   *
   * @param {object} req - The request object containing the query string.
   * @param {object} res - The response object used to render the view.
   */
  static async getPostsByTags(req, res) {
    try {
      // Check if tags are provided in the query string.
      // If they are, split the string by commas to create an array.
      let selectedTags = req.query.tags ? req.query.tags.split(',') : [];
      
      // Convert each tag to an integer and filter out any non-numeric values.
      selectedTags = selectedTags
        .map(tag => parseInt(tag, 10))
        .filter(tag => !isNaN(tag));
      
    
      
      let post = [];
      
      // Fetch posts that have any of the selected tag IDs using TagService.
      post = await TagService.getPostsByTags(selectedTags);
      
      
      // Retrieve all available tags to display as options on the page.
      const tags = await TagService.getAllTags();
      const posts = await PostService.getAllPosts();
      
      // Render the 'home' page using the Pug template,
      // passing in the title, the posts that match the tags, and all available tags.
      res.render('searchpost', { 
        title: 'Peerly - Tags',
        post: post,
        tags: tags,
        posts
      });
    } catch (error) {
      // If any error occurs during processing, log it and render an error page.
      console.error('Error fetching posts by tags:', error);
      res.status(500).render('error', { 
        title: 'Server Error',
        message: 'Failed to load tagged posts'
      });
    }
  }
}

// Export the TagController so it can be used in route definitions.
module.exports = TagController;
