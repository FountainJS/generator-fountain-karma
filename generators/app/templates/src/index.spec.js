<% if (framework === 'angular2') { -%>
require('reflect-metadata');
<% } -%>
<% if (js === 'js') { -%>
var context = require.context('./app', true, /\.js$/);
<% } else { -%>
const context = require.context('./app', true, /\.(js|ts|tsx)$/);
<% } -%>
context.keys().forEach(context);
