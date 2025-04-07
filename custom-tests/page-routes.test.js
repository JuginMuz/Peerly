/**
 * page-routes.test.js
 *
 * This file contains Nightwatch tests that verify key pages in our application
 * are loading properly. Each test navigates to a specific route and checks
 * for an expected piece of text in the rendered content.
 *
 */

module.exports = {
    '@tags': ['pages'],
  
    // Test for the /api/signin route, which serves signIn.pug
    'SignIn Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/signin')
        .waitForElementVisible('body', 3000)
        // We expect "Sign up now" to appear on the sign-in page
        .assert.containsText('body', 'Sign up now')
        .end();
    },
  
    // Test for the /api/login route, which serves login.pug
    'Login Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/login')
        .waitForElementVisible('body', 3000)
        // The login page should have a button labeled "Log In"
        .assert.containsText('body', 'Log In')
        .end();
    },
  
    // Test for the /api/register route, which serves register.pug
    'Register Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/register')
        .waitForElementVisible('body', 3000)
        // The registration page should show "Create Account"
        .assert.containsText('body', 'Create Account')
        .end();
    },
  
    // Test for the /api/home route, which serves home.pug
    'Home Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/home')
        .waitForElementVisible('body', 3000)
        // The home page has a "Post" button
        .assert.containsText('body', 'Post')
        .end();
    },
  
    // Test for the /api/users route, which serves explore.pug
    'Explore Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/users')
        .waitForElementVisible('body', 3000)
        // The explore page contains "Send Friend Request" text
        .assert.containsText('body', 'Send Friend Request')
        .end();
    },
  
    // Test for the /api/home/:post_id route, which serves post_details.pug
    'Post Details Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/home/1') // Post with ID = 1
        .waitForElementVisible('body', 3000)
        // The post details page displays a "Comments" heading
        .assert.containsText('body', 'Comments')
        .end();
    },
  
    // Test for the /api/users/:user_id route, which serves user-accounts.pug
    'User Account Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/users/ALI0001') // ALI0001 is Alice
        .waitForElementVisible('body', 3000)
        // Confirm that "Alice Smith" is present on the user's account page
        .assert.containsText('body', 'Alice Smith')
        .end();
    },
  
    // Test for the /api/users/:user_id/settings route, which serves user-settings.pug
    'User Settings Page Loads': function (browser) {
      browser
        .url('http://localhost:3000/api/users/ALI0001/settings')
        .waitForElementVisible('body', 3000)
        // The settings page should have an <h1> with "Settings"
        .assert.containsText('body', 'Settings')
        .end();
    }
  };
  