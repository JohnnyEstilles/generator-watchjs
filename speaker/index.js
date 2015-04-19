'use strict';

var fs = require('fs');
var yeoman = require('yeoman-generator');
var slug = require('slug');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the watch.js speaker subgenerator.');
  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
      type: 'input',
      name: 'file',
      message: 'Speaker file',
      default: 'data/speakers/speakers.json'
    }, {
      type: 'input',
      name: 'name',
      message: 'Speaker name'
    }], function (answers) {
      this.options.file = answers.file;
      var generatedSlug = slug(answers.name, {lower: true});
      this.log('Generated slug is: ' + generatedSlug);
      this.options.speaker = {
        id: generatedSlug,
        name: answers.name
      };
      done();
    }.bind(this));
  },

  writing: function () {
    function str2json(value){ return JSON.stringify(value, null, 4); }
    var newSpeaker = this.options.speaker;
    this.log('Trying to add: ' + str2json(newSpeaker));
    var content = JSON.parse(fs.readFileSync(this.options.file, 'utf8'));
    this.log('Reading ' + this.options.file + ' file, found ' + content.length + ' elements.');

    var sameIdElement = _.find(content, function(el){ return el.id === newSpeaker.id; });
    if (sameIdElement) {
      this.log('Element with the same `id` exists:' + str2json(sameIdElement));
    }

    var sameNameElement = _.find(content, function(el){ return el.name === newSpeaker.name; });
    if (sameNameElement) {
      this.log('Element with the same `name` exists:' + str2json(sameNameElement));
    }

    if (!sameIdElement && !sameNameElement) {
      this.log('Similar element hasn\'t been found, appending to file.');
      content.push(newSpeaker);
      fs.writeFileSync(this.options.file, str2json(content));
      this.log('Done.');
    }
  }
});
