const conf = require('./gulp.conf');
<% if (modules === 'inject') { -%>
const path = require('path');
const wiredep = require('wiredep');
<% } -%>

<% if (modules === 'inject') { -%>
function listFiles() {
  var wiredepOptions = Object.assign({}, conf.wiredep, {
<%   if (framework === 'react') { -%>
    overrides: {
      react: { main: [ 'react-with-addons.js' ] }
    },
<%   } -%>
    dependencies: true,
    devDependencies: true
  });

  var patterns = [
    ...wiredep(wiredepOptions).js,
<%   if (framework === 'angular1') { -%>
    path.join(conf.paths.tmp, '/**/*.js'),
    pathSrcHtml
<%   } -%>
<%   if (framework === 'react') { -%>
    path.join(conf.paths.tmp, '/app/**/*.js')
<%   } -%>
  ];

  var files = patterns.map(pattern => ({ pattern: pattern }));
  files.push({
    pattern: path.join(conf.paths.src, '/assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
}

<% } -%>
module.exports = function (config) {
  var configuration = <%- json(karmaConf) %>;

  config.set(configuration);
};
