<% if (framework === 'angular2') { -%>
require('reflect-metadata');
<% } -%>

/* globals require */
<% if (js === 'babel') { -%>
const context = require.context('./app', true, /\.spec$/);
<% } else { -%>
var context = require.context('./app', true, /\.spec$/);
<% } -%>
context.keys().forEach(context);
