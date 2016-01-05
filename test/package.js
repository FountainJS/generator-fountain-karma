const TestUtils = require('fountain-generator').TestUtils;
const expect = require('chai').expect;

describe('generator fountain karma package', () => {
  beforeEach(function () {
    this.context = TestUtils.mock();
    require('../generators/app/index');
  });

  it('should add es6-shim in deps to ensure Phantom API', function () {
    const getDep = () => this.context.mergeJson['package.json'].devDependencies['es6-shim'];
    TestUtils.call(this.context, 'configuring.pkg');
    expect(getDep()).to.be.a('string');
    expect(getDep()).to.match(/^\^/);
  });
});
