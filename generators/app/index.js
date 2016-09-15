const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'karma': '^1.3.0',
          'karma-coverage': '^1.1.1',
          'karma-jasmine': '^1.0.2',
          'karma-junit-reporter': '^1.1.0',
          'jasmine': '^2.4.1',
          'es6-shim': '^0.35.0'
        }
      };

      if (this.options.framework === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'angular-mocks': '^1.5.0-beta.2',
            'gulp-ng-annotate': '^1.1.0',
            'karma-angular-filesort': '^1.0.0',
            'karma-ng-html2js-preprocessor': '^0.2.0'
          },
          eslintConfig: {
            globals: {
              expect: true
            }
          }
        });

        if (this.options.modules === 'inject') {
          _.merge(pkg, {
            devDependencies: {
              'karma-angular-filesort': '^1.0.0'
            }
          });
        }
      }

      if (this.options.framework !== 'angular2' && this.options.js === 'typescript') {
        _.merge(pkg, {
          devDependencies: {
            'karma-es6-shim': '^1.0.0'
          }
        });
      }

      if (this.options.framework === 'angular2') {
        if (process.env.TRAVIS) {
          _.merge(pkg, {
            devDependencies: {
              'karma-firefox-launcher': '^0.1.7'
            }
          });
        } else {
          _.merge(pkg, {
            devDependencies: {
              'karma-chrome-launcher': '^0.2.3'
            }
          });
        }
        if (this.options.modules === 'systemjs') {
          _.merge(pkg, {
            devDependencies: {
              glob: '^7.0.3'
            }
          });
        }
      } else {
        _.merge(pkg, {
          devDependencies: {
            'karma-phantomjs-launcher': '^1.0.0',
            'karma-phantomjs-shim': '^1.1.2',
            'phantomjs-prebuilt': '^2.1.6'
          }
        });
      }

      if (this.options.modules === 'webpack') {
        _.merge(pkg, {
          devDependencies: {
            'babel-plugin-istanbul': '^2.0.1',
            'karma-webpack': '^1.7.0'
          }
        });
      }

      if (this.options.modules === 'systemjs') {
        _.merge(pkg, {
          devDependencies: {
            'karma-jspm': '^2.0.2'
          }
        });

        if (this.options.framework === 'angular1' && this.options.js === 'typescript') {
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
      const options = Object.assign({}, {singleRun: true}, this.options);
      options.karmaConf = conf(options);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma.conf.js', options);

      options.singleRun = false;
      options.karmaConf = conf(options);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma-auto.conf.js', options);

      if (this.options.modules === 'inject') {
        this.copyTemplate('conf/karma-files.conf.js', 'conf/karma-files.conf.js');
      }
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        {modules: this.options.modules}
      );
    },

    src() {
      if (this.options.modules === 'webpack') {
        this.fs.copyTpl(
          this.templatePath('src/index.spec.js'),
          this.destinationPath('src/index.spec.js'),
          {framework: this.options.framework, js: this.options.js, sample: this.options.sample}
        );
      }
    }
  }
});
