'use strict';

const lit = require('fountain-generator').lit;

module.exports = function karmaConf(props) {
  const conf = {
    basePath: '../',
    singleRun: props.singleRun,
    autoWatch: !props.singleRun,
    logLevel: 'INFO',
    junitReporter: {outputDir: 'test-reports'}
  };

  if (props.framework === 'angular2') {
    if (process.env.TRAVIS) {
      conf.browsers = ['Chrome_travis_ci'];
      conf.customLaunchers = lit`{
    Chrome_travis_ci: { // eslint-disable-line camelcase
      base: 'Chrome',
      flags: ['--no-sandbox']
    }
  }`;
    } else {
      conf.browsers = ['Chrome'];
    }
  } else {
    conf.browsers = ['PhantomJS'];
  }

  const pathSrcJs = lit`conf.path.src('index.spec.js')`;
  const pathSrcHtml = lit`conf.path.src('**/*.html')`;

  if (props.modules === 'systemjs') {
    conf.frameworks = ['jasmine', 'jspm'];
  } else if (props.modules === 'inject' && props.framework === 'angular1') {
    conf.frameworks = ['phantomjs-shim', 'jasmine', 'angular-filesort'];
  } else {
    conf.frameworks = ['jasmine'];
  }

  if (props.modules === 'webpack') {
    conf.files = [
      'node_modules/es6-shim/es6-shim.js',
      pathSrcJs
    ];

    if (props.framework === 'angular1') {
      conf.files.push(pathSrcHtml);
    }
  }
  if (props.modules === 'inject') {
    conf.files = lit`listFiles()`;
  }

  if (props.modules === 'webpack' || props.framework === 'angular1') {
    conf.preprocessors = {};
  }
  if (props.modules === 'webpack') {
    conf.preprocessors[pathSrcJs] = ['webpack'];
  }
  if (props.framework === 'angular1') {
    conf.preprocessors[pathSrcHtml] = ['ng-html2js'];
    if (props.modules === 'systemjs' && props.js === 'typescript') {
      conf.preprocessors[pathSrcHtml].push('generic');
      conf.genericPreprocessor = {
        rules: [lit`{
        process(content, file, done) {
          file.path = file.path.replace(/\\.js$/, '.ts');
          done(content);
        }
      }`]
      };
    }
  }

  if (props.framework === 'angular1') {
    conf.ngHtml2JsPreprocessor = {};

    if (props.modules !== 'systemjs') {
      conf.ngHtml2JsPreprocessor.stripPrefix = lit`\`\${conf.paths.src}/\``;
    }

    if (props.modules === 'inject') {
      conf.ngHtml2JsPreprocessor.moduleName = 'app';
      conf.angularFilesort = {
        whitelist: [lit`conf.path.tmp('**/!(*.html|*.spec|*.mock).js')`]
      };
    }
  }

  if (props.modules === 'webpack') {
    conf.reporters = lit`['progress', 'coverage']`;
    conf.coverageReporter = {
      type: 'html',
      dir: 'coverage/'
    };
    conf.webpack = lit`require('./webpack-test.conf')`;
    conf.webpackMiddleware = {noInfo: true};
  }

  if (props.modules === 'systemjs') {
    conf.jspm = {
      loadFiles: [],
      config: 'jspm.config.js',
      browser: 'jspm.test.js'
    };
    let files;
    if (props.js === 'typescript') {
      if (props.framework === 'react') {
        files = `conf.path.src('app/**/*.tsx')`;
      } else {
        files = `conf.path.src('app/**/*.ts')`;
      }
    } else {
      files = `conf.path.src('app/**/*.js')`;
    }
    if (props.framework === 'angular2') {
      // http://stackoverflow.com/questions/35873437/enfile-file-table-overflow-with-karma
      conf.jspm.loadFiles = lit`glob.sync(${files})`;
    } else if (props.framework === 'angular1') {
      conf.jspm.loadFiles.push(lit`${files}`);
      conf.jspm.loadFiles.push(lit`conf.path.src('**/*.html')`);
    } else {
      conf.jspm.loadFiles.push(lit`${files}`);
    }
  }

  conf.plugins = [
    lit`require('karma-jasmine')`,
    lit`require('karma-junit-reporter')`,
    lit`require('karma-coverage')`
  ];

  if (props.framework === 'angular2') {
    conf.plugins.push(lit`require('karma-chrome-launcher')`);
  } else {
    conf.plugins.push(lit`require('karma-phantomjs-launcher')`);
    conf.plugins.push(lit`require('karma-phantomjs-shim')`);
  }
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
  if (props.modules === 'systemjs' && props.framework === 'angular1' && props.js === 'typescript') {
    conf.plugins.push(lit`require('karma-generic-preprocessor')`);
  }

  return conf;
};
