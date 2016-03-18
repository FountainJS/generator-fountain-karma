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
    conf.jspm = {
      loadFiles: []
      config: 'jspm.config.js'
    };

    if (props.framework === 'angular2') {
      conf.jspm.loadFiles.push(
        'jspm_packages/npm/reflect-metadata@0.1.2/Reflect.js',
        'node_modules/es6-shim/es6-shim.js'
      );
    }

    if (props.js === 'typescript') {
      if (props.framework === 'react') {
        conf.jspm.loadFiles.push(lit`conf.path.src('app/**/*.tsx')`);
      } else {
        conf.jspm.loadFiles.push(lit`conf.path.src('app/**/*.ts')`);
      }
    } else {
      conf.jspm.loadFiles.push(lit`conf.path.src('app/**/*.js')`);
    }

    // if (props.framework !== 'react') {
    if (props.framework === 'angular1') {
      conf.jspm.loadFiles.push(lit`conf.path.src('**/*.html')`);
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
  if (props.modules === 'systemjs' && props.framework === 'angular1' && props.js === 'typescript') {
    conf.plugins.push(lit`require('karma-generic-preprocessor')`);
  }

  return conf;
};
