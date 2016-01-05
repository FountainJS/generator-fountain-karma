'use strict';

const TestUtils = require('fountain-generator').TestUtils;
const expect = require('chai').expect;
const conf = require('../generators/app/conf');

describe('generator fountain karma conf', () => {
  it('should load right source extension files with JSPM', () => {
    const props = TestUtils.defaults();
    props.framework = 'angular1';
    props.modules = 'systemjs';
    props.js = 'js';
    let jsonConf = conf(props);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.js'\)<<lit/);

    props.js = 'typescript';
    jsonConf = conf(props);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.ts'\)<<lit/);

    props.framework = 'react';
    jsonConf = conf(props);
    expect(jsonConf.jspm.loadFiles[0]).to.match(/\.tsx'\)<<lit/);
  });
});
