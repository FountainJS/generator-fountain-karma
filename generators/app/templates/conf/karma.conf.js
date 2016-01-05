<% if (modules === 'inject') { -%>
const listFiles = require('./karma-files.conf.js');

<% } -%>
module.exports = function (config) {
  var configuration = <%- json(karmaConf, 2) %>;

  config.set(configuration);
};
