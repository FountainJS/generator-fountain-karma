<% if (framework === 'angular2') { -%>
require('reflect-metadata');
<% } -%>

/* globals require */
<% if (js === 'js') { -%>
var context = require.context('./app', true, /\.spec$/);
<% } else { -%>
const context = require.context('./app', true, /\.spec$/);
<% } -%>
context.keys().forEach(context);
