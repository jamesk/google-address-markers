requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery",
      'async': 'requirejs-plugins/async'
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
