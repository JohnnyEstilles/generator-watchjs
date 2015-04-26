'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var _ = require('lodash');
var fs = require('fs');
var slug = require('slug');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the watch.js video subgenerator.');
  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
      type: 'input',
      name: 'file',
      message: 'Video file',
      default: 'others.json'
    }, {
      type: 'input',
      name: 'title',
      message: 'Video title'
    }, {
      type: 'input',
      name: 'keywords',
      message: 'Video keywords',
      default: ['javascript']
    }, {
      type: 'input',
      name: 'videoId',
      message: 'Youtube video id'
    }, {
      type: 'input',
      name: 'speakerId',
      message: 'Speaker id'
    }, {
      type: 'input',
      name: 'eventId',
      message: 'Event id'
    }], function (answers) {
      this.options.file = 'data/videos/' + answers.file + '.json';
      this.options.video = {
        videoId: answers.videoId,
        title: answers.title,
        keywords: answers.keywords,
        speakerId: answers.speakerId,
        eventId: answers.eventId
      };
      done();
    }.bind(this));
  },

  writing: function () {
    function str2json(value){ return JSON.stringify(value, null, 4); }
    var newVideo = this.options.video;
    this.log('Trying to add: ' + str2json(newVideo) + "\n");
    var content = JSON.parse(fs.readFileSync(this.options.file, 'utf8'));
    this.log('Reading ' + chalk.yellow.bold(this.options.file) + ' file, found ' + content.length + ' elements.');

    var sameIdElement = _.find(content, function(el){ return el.videoId === newVideo.videoId; });
    if (sameIdElement) {
      this.log(chalk.red('Element with the same `id` exists:' + str2json(sameIdElement)));
    }

    var sameNameElement = _.find(content, function(el){ return el.title === newVideo.title; });
    if (sameNameElement) {
      this.log(chalk.red('Element with the same `name` exists:' + str2json(sameNameElement)));
    }

    if (!sameIdElement && !sameNameElement) {
      this.log('Similar element hasn\'t been found.');
      content.push(newVideo);
      this.log('Appending to collection and sorting');
      content = _.sortBy(content, function(el){ return el.id; });
      this.log('Rewriting file.');
      fs.writeFileSync(this.options.file, str2json(content));
      this.log('Done.');
    }
  }
});
