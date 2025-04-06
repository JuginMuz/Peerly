// controllers/TagController.js
const TagService = require('../services/TagService');

class TagController {
  
    static async getPostsByTags(req, res) {
      try {
        // Grabs the tags from the query string. If there are tags, split them by commas.
        let selectedTags = req.query.tags ? req.query.tags.split(',') : [];
        
        // Converts the tag values to integers and filter out any that aren't numbers.
        selectedTags = selectedTags.map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
        
        // Logs the tags we got for debugging purposes.
        console.log("Selected Tags:", selectedTags);
        
        let posts = [];
        
        // Fetchs posts that match the selected tag IDs using our TagService.
        posts = await TagService.getPostsByTags(selectedTags);
        
        // Logs the posts we fetched; helps with troubleshooting.
        console.log("Fetched Posts:", posts);
        
        // Gets all available tags, likely for displaying as options on the page.
        const tags = await TagService.getAllTags();
        
        // Render the home page with the posts and tags we've gathered.
        res.render('home', { 
          title: 'Peerly - Tags',
          posts: posts,
          tags: tags
        });
      } catch (error) {
        // Ifs something goes wrong, log the error and render an error page with a friendly message.
        console.error('Error fetching posts by tags:', error);
        res.status(500).render('error', { 
          title: 'Server Error',
          message: 'Failed to load tagged posts'
        });
      }
    }
}
    
module.exports = TagController;
