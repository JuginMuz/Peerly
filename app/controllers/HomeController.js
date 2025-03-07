// controllers/HomeController.js
class HomeController {
    static async renderHomePage(req, res) {
        //static method that renders the homepage and I made it async
        //so its able to handle asynchronous operations if needed
      try {
        //renders the homepage using pug
        res.render('homepage', { title: 'Peerly - Home' });
      } catch (error) {
        res.status(500).send('Error rendering home page');
      }
    }
  }
  
module.exports = HomeController;
  