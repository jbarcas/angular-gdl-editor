//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      // First: Load AngularJS
      { pattern: 'bower_components/angular/angular.js', watched: false },
      // Them angular modules
      { pattern: 'bower_components/angular-route/angular-route.js', watched: false },
      { pattern: 'bower_components/angular-mocks/angular-mocks.js', watched: false },
      // Then other libraries
      { pattern: 'bower_components/angular-ui-router/release/angular-ui-router.min.js', watched: false },
      { pattern: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js', watched: false },
      { pattern: 'bower_components/karma-read-json/karma-read-json.js', watched: false },
      { pattern: 'assets/**/*.json', included: false },
      // Then the app scripts
      'app.js',
      'config/**/*.js',
      'components/**/!(*.spec).js',
      // Finally, load the tests
      'components/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
