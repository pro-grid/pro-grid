'use strict';

if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

// dependencies

// Set up redis
var redisClient;
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(':')[1]);
} else {
  redisClient = redis.createClient();
}


var gridProperties = {
  dimensions: process.env.GRID_DIMENSIONS || 64
};

// Get our modules
var Grid = require('./grid');


var progridserver = function (grid) {
  // global deps
  var express = require('express');
  var app = express();
  var server = require('http').createServer(app);
  var ioServer = require('socket.io').listen(server);
  var path = require('path');
  var randomColor = require('randomcolor');

  // progrid deps
  var ApiKeyHandler = require('./apikeyhandler');
  var clientValidator = require('./clientvalidator');

  // core app logic
  var port = process.env.PORT || 9001;
  server.listen(port);

  app.use(express.static(path.normalize(__dirname +  '/../site/')));

  app.get('/', function (req, res) {
    res.sendfile(path.normalize(__dirname +  '/../site/index.html'));
  });

  // describe client connection
  ioServer.sockets.on('connection', function (socket) {
    ApiKeyHandler.newKey(socket, null, function (socket) { // DIRTY FIX ME
      socket.emit('server ready', { gridArray: grid.gridMatrix, userColor: randomColor.randomColor()});
      //Socket listener for user click
      socket.on('clicked', function (data) {
        if(clientValidator(data, gridProperties.dimensions)) {
          new ApiKeyHandler(socket, data.apiKey, function() {
            grid.updateGrid(socket, data);
          });
        } else {
          console.warn('warning: user provided invalid data: %s %s %s %s', data.row, data.col, data.color, data.apiKey);
        }
      });
      socket.on('disconnect', function() {
        ApiKeyHandler.delete(socket.id);
      });
    });
  });
};

new Grid(gridProperties.dimensions, redisClient)
  .then(function (gridInstance) {
    progridserver(gridInstance);
  });

