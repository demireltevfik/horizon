'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function(config) {
  var xstaticPath;
  var basePaths = [
    './.venv',
    './.tox/py27'
  ]

  for (var i = 0; i < basePaths.length; i++) {
    var basePath = path.resolve(basePaths[i]);

    if (fs.existsSync(basePath)) {
      xstaticPath = basePath + '/lib/python2.7/site-packages/xstatic/pkg/';
      break;
    }
  }

  if (!xstaticPath) {
    console.error("xStatic libraries not found, please set up venv");
    process.exit(1);
  }

  config.set({

    preprocessors: {
      // Used to collect templates for preprocessing.
      // NOTE: the templates must also be listed in the files section below.
      './**/*.html': ['ng-html2js'],
      // Used to indicate files requiring coverage reports.
      './**/!(*spec).js': ['coverage']
    },

    // Sets up module to process templates.
    ngHtml2JsPreprocessor: {
      prependPrefix: '/static/',
      moduleName: 'templates'
    },

    // Assumes you're in the top-level horizon directory.
    basePath : './static/',

    // Contains both source and test files.
    files : [

      // shim, partly stolen from /i18n/js/horizon/
      // Contains expected items not provided elsewhere (dynamically by
      // Django or via jasmine template.
      '../../test-shim.js',

      // from jasmine.html
      xstaticPath + 'jquery/data/jquery.js',
      xstaticPath + 'angular/data/angular.js',
      xstaticPath + 'angular/data/angular-mocks.js',
      xstaticPath + 'angular/data/angular-cookies.js',
      xstaticPath + 'angular_bootstrap/data/angular-bootstrap.js',
      xstaticPath + 'angular/data/angular-sanitize.js',
      xstaticPath + 'd3/data/d3.js',
      xstaticPath + 'rickshaw/data/rickshaw.js',
      xstaticPath + 'angular_lrdragndrop/data/lrdragndrop.js',
      // Needed by modal spinner
      xstaticPath + 'spin/data/spin.js',
      xstaticPath + 'spin/data/spin.jquery.js',

      // TODO: These should be mocked.
      '../../horizon/static/horizon/js/horizon.js',
      '../../horizon/static/framework/util/http/http.js',

      /**
       * First, list all the files that defines application's angular modules.
       * Those files have extension of `.module.js`. The order among them is
       * not significant.
       */
      '**/*.module.js',
      '**/workflow.js',
      '**/launch-instance.js',

      /**
       * Followed by other JavaScript files that defines angular providers
       * on the modules defined in files listed above. And they are not mock
       * files or spec files defined below. The order among them is not
       * significant.
       */
      '**/!(*.spec|*.mock).js',

      /**
       * Then, list files for mocks with `mock.js` extension. The order
       * among them should not be significant.
       */
      '**/*.mock.js',

      /**
       * Finally, list files for spec with `spec.js` extension. The order
       * among them should not be significant.
       */
      '**/*.spec.js',

      /**
       * Angular external templates
       */
      '**/*.html'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered
      // (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    reporters : [ 'progress', 'coverage' ],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],

    coverageReporter: {
      type : 'html',
      dir : '../.coverage-karma/'
    }

  });
};
