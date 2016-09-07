<% if (framework === 'angular2') { -%>
Error.stackTraceLimit = Infinity;

require('core-js/client/shim');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
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
