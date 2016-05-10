'use strict';

const TestUtils = require('fountain-generator').TestUtils;
const expect = require('chai').expect;
const conf = require('../generators/app/conf');

describe('generator fountain karma conf', () => {
  it('should load right source extension files with JSPM', () => {
    const options = TestUtils.defaults();
    options.framework = 'angular1';
    options.modules = 'systemjs';
    options.js = 'js';
    let jsonConf = conf(options);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.js'\)<<lit/);

    options.js = 'typescript';
    jsonConf = conf(options);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.ts'\)<<lit/);

    options.framework = 'react';
    jsonConf = conf(options);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.tsx'\)<<lit/);
  });
});
