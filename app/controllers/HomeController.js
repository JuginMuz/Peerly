// controllers/HomeController.js

// Define the HomeController class which contains methods to render different pages.
class HomeController {
  /**
   * Renders the home (sign-in) page.
   * This method is asynchronous to allow for future asynchronous operations if needed.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  static async renderHomePage(req, res) {
    try {
      // Render the 'signin' page using our Pug template, with a title for the page.
      res.render('signin', { title: 'Peerly - SignIn' });
    } catch (error) {
      // If there's an error rendering the page, send a 500 status with an error message.
      res.status(500).send('Error rendering SignIn page');
    }
  }

  /**
   * Renders the login page.
   * Uses the 'login' Pug template to display the login screen.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  static async renderLoginPage(req, res) {
    try {
      // Render the 'login' template with a title.
      res.render('login', { title: 'Peerly - Login' });
    } catch (error) {
      // If there's a problem rendering the login page, return a 500 status.
      res.status(500).send('Error rendering login page');
    }
  }

  /**
   * Renders the registration page.
   * This method displays the account creation page using the 'register' Pug template.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  static async renderRegisterPage(req, res) {
    try {
      // Render the 'register' template with a title.
      res.render('register', { title: 'Peerly - Create Account' });
    } catch (error) {
      // If the registration page fails to render, send a 500 error with a message.
      res.status(500).send('Error rendering register page');
    }
  }
}

// Export the HomeController class so that it can be used in route definitions.
module.exports = HomeController;
