var Backbone = require('backbone');
Backbone.Application = require('../backbone.application');

var app = Backbone.Application()
  .use(require('./plugin/init.js'))
  .on('ready', function () {
    console.log('app is ready');
  });

app.start();