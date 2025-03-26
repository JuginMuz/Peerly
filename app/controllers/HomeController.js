// controllers/HomeController.js
class HomeController {
    static async renderHomePage(req, res) {
        //static method that renders the homepage and I made it async
        //so its able to handle asynchronous operations if needed
      try {
        //renders the homepage using pug
        res.render('signin', { title: 'Peerly - SignIn' });
      } catch (error) {
        res.status(500).send('Error rendering SignIn page');
      }
    }
    static async renderLoginPage(req, res) {
      try {
        // Render our new 'login' pug template
        res.render('login', { title: 'Peerly - Login' });
      } catch (error) {
        res.status(500).send('Error rendering login page');
      }
    }
    
  }
  
  
  
module.exports = HomeController;
  