<% if (framework === 'angular2') { -%>
require('reflect-metadata');
<% } -%>
<% if (framework === 'angular1' && sample === 'todoMVC' && js === 'babel') { -%>
require('babel-polyfill');
<% } -%>
<% if (js === 'js') { -%>
var context = require.context('./app', true, /\.js$/);
<% } else { -%>
const context = require.context('./app', true, /\.(js|ts|tsx)$/);
<% } -%>
context.keys().forEach(context);
<% if (framework === 'angular2') { -%>
const testing = require('@angular/core/testing');
const testingBrowser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule, testingBrowser.platformBrowserDynamicTesting());
<% } -%>
