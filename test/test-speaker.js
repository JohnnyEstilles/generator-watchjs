'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var inspect = require('util').inspect;

describe('watchjs:speaker', function () {
  before(function (done) {
    var self = this;
    var name = 'John Doe';
    var testPath = path.join(__dirname, 'temp');

    // store in test obejct for later use
    this.filePath = path.join(testPath, 'speaker.json');

    helpers.run(path.join(__dirname, '../speaker'))
      .inDir(testPath)
      .withPrompts({ 'file': self.filePath, 'name': name })
      .withOptions({ 'skip-install': true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file(this.filePath);
    assert.fileContent(this.filePath, /\"id\":.*\"john-doe\"/);
    assert.fileContent(this.filePath, /\"name\":.*\"John Doe\"/);
  });

});
