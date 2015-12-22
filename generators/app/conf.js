const lit = require('fountain-generator').lit;

module.exports = function karmaConf(props) {
  const conf = {
    browsers: ['PhantomJS'],
    basePath: '../',
    singleRun: props.singleRun,
    autoWatch: !props.singleRun,
    logLevel: 'INFO',
    junitReporter: { outputDir: 'test-reports' }
  };

  const pathSrcJs = lit`conf.path.src('index.spec.js')`;
  const pathSrcHtml = lit`conf.path.src('**/*.html')`;

  if (props.modules === 'systemjs') {
    conf.frameworks = ['phantomjs-shim', 'jspm', 'jasmine'];
  } else if (props.modules === 'inject' && props.framework === 'angular1') {
    conf.frameworks = ['phantomjs-shim', 'jasmine', 'angular-filesort'];
  } else {
    conf.frameworks = ['phantomjs-shim', 'jasmine'];
  }

  if (props.modules === 'webpack') {
    conf.files = [
      'node_modules/es6-shim/es6-shim.js',
      pathSrcJs
    ];
  }
  if (props.modules === 'inject') {
    conf.files = lit`listFiles()`;
  }

  conf.preprocessors = {};
  if (props.modules === 'webpack') {
    conf.preprocessors[pathSrcJs] = ['webpack'];
  }
  if (props.framework === 'angular1') {
    conf.preprocessors[pathSrcHtml] = ['ng-html2js'];
  }

  if (props.framework === 'angular1') {
    conf.ngHtml2JsPreprocessor = {
      stripPrefix: lit`\`\${conf.paths.src}/\``,
      moduleName: 'app'
    };

    if (props.modules === 'inject') {
      conf.angularFilesort = {
        whitelist: [lit`conf.path.tmp('**/!(*.html|*.spec|*.mock).js')`]
      };
    }
  }

  if (props.modules === 'webpack') {
    conf.webpack = lit`require('./webpack-test.conf.js')`;
    conf.webpackMiddleware = { noInfo: true };
  }

  if (props.modules === 'systemjs') {
    conf.jspm = {};

    if (props.framework === 'angular2') {
      conf.jspm.loadFiles = [
        'jspm_packages/npm/reflect-metadata@0.1.2/Reflect.js',
        'node_modules/es6-shim/es6-shim.js',
        // Very strange bug, using *.js fail with an "ENFILE" file error
        lit`conf.path.src('app/hello.js')`,
        lit`conf.path.src('app/hello.spec.js')`
      ];
    } else if (props.framework === 'angular1') {
      conf.jspm.loadFiles = [lit`conf.path.src('**/*.js')`];
    } else {
      conf.jspm.loadFiles = [lit`conf.path.src('app/**/*.js')`];
    }
  }

  conf.plugins = [
    lit`require('karma-jasmine')`,
    lit`require('karma-junit-reporter')`,
    lit`require('karma-phantomjs-launcher')`,
    lit`require('karma-phantomjs-shim')`,
    lit`require('karma-coverage')`
  ];

  if (props.framework === 'angular1') {
    conf.plugins.push(lit`require('karma-ng-html2js-preprocessor')`);
  }
  if (props.modules === 'webpack') {
    conf.plugins.push(lit`require('karma-webpack')`);
  }
  if (props.modules === 'systemjs') {
    conf.plugins.push(lit`require('karma-jspm')`);
  }
  if (props.modules === 'inject' && props.framework === 'angular1') {
    conf.plugins.push(lit`require('karma-angular-filesort')`);
  }

  return conf;
};
