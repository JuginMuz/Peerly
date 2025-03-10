// controllers/HomeController.js
class AccountController {
    static async renderAccountPage(req, res) {
        //static method that renders the homepage and I made it async
        //so its able to handle asynchronous operations if needed
      try {
        //renders the user account using pug
        res.render('user-account', { title: 'Peerly - Account' });
      } catch (error) {
        res.status(500).send('Error rendering user account page');
      }
    }
  }
 
module.exports = AccountController;