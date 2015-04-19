'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var _ = require('lodash');
var fs = require('fs');
var slug = require('slug');

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
      this.log('Generated slug is: ' + chalk.yellow.bold(generatedSlug));
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
    this.log('Trying to add: ' + str2json(newSpeaker) + "\n");
    var content = JSON.parse(fs.readFileSync(this.options.file, 'utf8'));
    this.log('Reading ' + chalk.yellow.bold(this.options.file) + ' file, found ' + content.length + ' elements.');

    var sameIdElement = _.find(content, function(el){ return el.id === newSpeaker.id; });
    if (sameIdElement) {
      this.log(chalk.red('Element with the same `id` exists:' + str2json(sameIdElement)));
    }

    var sameNameElement = _.find(content, function(el){ return el.name === newSpeaker.name; });
    if (sameNameElement) {
      this.log(chalk.red('Element with the same `name` exists:' + str2json(sameNameElement)));
    }

    if (!sameIdElement && !sameNameElement) {
      this.log('Similar element hasn\'t been found.');
      content.push(newSpeaker);
      this.log('Appending to collection and sorting');
      content = _.sortBy(content, function(el){ return el.id; });
      this.log('Rewriting file.');
      fs.writeFileSync(this.options.file, str2json(content));
      this.log('Done.');
    }
  }
});
