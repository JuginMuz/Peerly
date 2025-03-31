// controllers/PostController.js
const CommentService = require('../services/CommentService');
const PostService = require('../services/PostService');
const TagService = require('../services/TagService');
class PostController {



 // GET POST DETAILS// Retrieves and displays details for a specific post, including its comments.
static async getPostDetails(req, res) {
  try {
    // Extracts the post ID from the request parameters.
    const postId = req.params.post_id;
    
    // Fetchs the post details using the PostService.
    const post = await PostService.getPostById(postId);
    
    // If the post is not found, return a 404 error with a relevant message.
    if (!post) {
      return res.status(404).render('error', { 
        title: 'Post Not Found', 
        message: `Post with ID ${postId} not found.` 
      });
    }
    
    // Retrieves all comments associated with the post.
    const comments = await CommentService.getByPostId(postId);
    
    // Render the post details page, passing the retrieved post and comments.
    res.render('posts_details', { title: 'Post Details', post, comments });
  } catch (error) {
    // Handles any unexpected errors by displaying a server error page.
    res.status(500).render('error', { 
      title: 'Server Error', 
      message: error.message 
    });
  }
}



  //LISTING PAGE
  static async getAllPosts(req, res) {
    try {
      // Fetch all posts using our PostService.
      const posts = await PostService.getAllPosts();
      // Also, fetch all the tags from TagService.
      const tags = await TagService.getAllTags();
      // Render the home page with the posts and tags we've retrieved.
      res.render('Home', { 
        title: 'Peerly - Home',
        posts: posts,
        tags: tags
      });
    } catch (error) {
      // Log the error for debugging and show an error page if something goes wrong.
      console.error('Error fetching posts:', error);
      res.status(500).render('error', { 
        title: 'Server Error',
        message: 'Failed to load home page'
      });
    }
  }
  




  //DELETE A POST
  static async deletePost(req, res) {
    try {
      const postId = req.params.post_id;
      const result = await PostService.deletePost(postId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found or already deleted.' });
      }
      
      res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostController;
