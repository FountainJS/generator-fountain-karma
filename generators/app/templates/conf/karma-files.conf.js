const conf = require('./gulp.conf');
const wiredep = require('wiredep');

module.exports = function listFiles() {
  const wiredepOptions = Object.assign({}, conf.wiredep, {
<% if (framework === 'react') { -%>
    overrides: {
      react: {main: ['react-with-addons.js']}
    },
<% } -%>
    dependencies: true,
    devDependencies: true
  });

  const patterns = wiredep(wiredepOptions).js.concat([
<% if (framework === 'angular1') { -%>
    conf.path.tmp('**/*.js'),
    conf.path.src('**/*.html')
<% } -%>
<% if (framework === 'react') { -%>
    conf.path.tmp('app/**/*.js')
<% } -%>
  ]);

  const files = patterns.map(pattern => ({pattern}));
  files.push({
    pattern: conf.path.src('assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
};
