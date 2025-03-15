// controllers/TagController.js
const TagService = require('../services/TagService');

class TagController {
  /*static async createTag(req, res) {
    try {
      const tag = await TagService.createTag(req.body.tag_name);
      res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } */

    static async getPostsByTags(req, res) {
        try {
          let selectedTags = req.query.tags ? req.query.tags.split(',') : [];
          // Convert query string values to integers
          selectedTags = selectedTags.map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
          console.log("Selected Tags:", selectedTags); // Debugging step
          let posts = [];
            
              posts = await TagService.getPostsByTags(selectedTags); // Fetch posts by tag ID
              console.log("Fetched Posts:", posts);
          
          const tags = await TagService.getAllTags();
          res.render('home', { 
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
  }
}
module.exports = TagController;
