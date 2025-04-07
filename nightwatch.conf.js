// nightwatch.conf.js

module.exports = {
  // Specify where your actual tests are located.
  src_folders: ['custom-tests'],

  // Commented out or removed additional paths I no longer use.
  // page_objects_path: ['nightwatch/page-objects'],
  // custom_commands_path: ['nightwatch/custom-commands'],
  // custom_assertions_path: ['nightwatch/custom-assertions'],

  plugins: [],
  globals_path: '',
  webdriver: {},

  // Enables parallel test running. Disable if you prefer sequential runs.
  test_workers: {
    enabled: true
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:3000',

      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },

      desiredCapabilities: {
        browserName: 'chrome'
      },

      webdriver: {
        start_process: true,
        server_path: ''
      }
    },

    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        alwaysMatch: {
          acceptInsecureCerts: false
        }
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: []
          }
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: []
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: []
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: []
      }
    },

    edge: {
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          args: []
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: []
      }
    }
  },

  usage_analytics: {
    enabled: true,
    log_path: './logs/analytics',
    client_id: 'b9a3785b-89e5-4183-9d58-a8eadb701697'
  }
};
