const _ = require('lodash');
var fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting: function () {
    this.fountainPrompting();
  },

  configuring: {
    package: function () {
      var pkg = {
        devDependencies: {
          karma: '^0.13.14',
          'karma-coverage': '^0.5.3',
          'karma-jasmine': '^0.3.6',
          'jasmine-core': '^2.4.1',
          'karma-junit-reporter': '^0.3.8',
          'karma-phantomjs-launcher': '^0.2.1',
          'karma-phantomjs-shim': '^1.1.2',
          phantomjs: '^1.9.19'
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
            'isparta-instrumenter-loader': '^1.0.0'
          }
        });
      }

      if (this.props.modules === 'systemjs') {
        _.merge(pkg, {
          devDependencies: {
            'karma-jspm': '^2.0.2'
          }
        });
      }

      this.mergeJson('package.json', pkg);
    },

    conf: function () {
      var options = {
        singleRun: true,
        framework: this.props.framework,
        modules: this.props.modules
      };

      this.fs.copyTpl(
        this.templatePath('conf/karma.conf.js'),
        this.destinationPath('conf/karma.conf.js'),
        options
      );

      if (this.props.modules === 'webpack') {
        this.fs.copyTpl(
          this.templatePath('conf/webpack-test.conf.js'),
          this.destinationPath('conf/webpack-test.conf.js'),
          options
        );
      }

      options.singleRun = false;

      this.fs.copyTpl(
        this.templatePath('conf/karma.conf.js'),
        this.destinationPath('conf/karma-auto.conf.js'),
        options
      );
    }
  },

  writing: {
    gulp: function () {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { modules: this.props.modules }
      );
    },

    src: function () {
      if (this.props.modules === 'webpack') {
        this.fs.copyTpl(
          this.templatePath('src/index.spec.js'),
          this.destinationPath('src/index.spec.js'),
          { framework: this.props.framework }
        );
      }
    }
  }
});
