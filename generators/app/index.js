const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  prompting() {
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'karma': '^0.13.14',
          'karma-coverage': '^0.5.3',
          'karma-jasmine': '^0.3.6',
          'jasmine-core': '^2.4.1',
          'karma-junit-reporter': '^0.3.8',
          'karma-phantomjs-launcher': '^0.2.1',
          'karma-phantomjs-shim': '^1.1.2',
          'phantomjs': '^1.9.19',
          'es6-shim': '^0.34.0'
        },
        scripts: {
          test: 'gulp karma:single-run'
        }
      };

      if (this.props.framework === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'angular-mocks': '^1.5.0-beta.2',
            'gulp-ng-annotate': '^1.1.0',
            'karma-angular-filesort': '^1.0.0',
            'karma-ng-html2js-preprocessor': '^0.2.0'
          }
        });

        if (this.props.modules === 'inject') {
          _.merge(pkg, {
            devDependencies: {
              'karma-angular-filesort': '^1.0.1'
            }
          });
        }
      }

      if (this.props.framework === 'angular2') {
        _.merge(pkg, {
          devDependencies: {
            'es6-shim': '^0.33.13'
          }
        });
      }

      if (this.props.modules === 'webpack') {
        _.merge(pkg, {
          devDependencies: {
            'karma-webpack': '^1.7.0',
            'isparta-loader': '^2.0.0'
          }
        });
      }

      if (this.props.modules === 'systemjs') {
        _.merge(pkg, {
          devDependencies: {
            'karma-jspm': '^2.0.2'
          }
        });

        if (this.props.framework === 'angular1' && this.props.js === 'typescript') {
          _.merge(pkg, {
            devDependencies: {
              'karma-generic-preprocessor': '^1.1.0'
            }
          });
        }
      }

      this.mergeJson('package.json', pkg);
    },

    conf() {
      const props = Object.assign({}, { singleRun: true }, this.props);
      props.karmaConf = conf(props);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma.conf.js', props);

      props.singleRun = false;
      props.karmaConf = conf(props);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma-auto.conf.js', props);

      if (this.props.modules === 'inject') {
        this.copyTemplate('conf/karma-files.conf.js', 'conf/karma-files.conf.js');
      }
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { modules: this.props.modules }
      );
    },

    src() {
      if (this.props.modules === 'webpack') {
        this.fs.copyTpl(
          this.templatePath('src/index.spec.js'),
          this.destinationPath('src/index.spec.js'),
          { framework: this.props.framework, js: this.props.js }
        );
      }
    }
  }
});
