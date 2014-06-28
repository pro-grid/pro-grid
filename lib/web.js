'use strict';

if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

// dependencies
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , ioServer = require('socket.io').listen(server)
  , path = require('path');
// valid api keys

var gridProperties = {
  dimensions: process.env.GRID_DIMENSIONS || 64
};

// Get our modules
var ApiKeyHandler = require('./apikeyhandler')
  , clientValidator = require('./clientvalidator')
  , Grid = require('./grid');

var grid = new Grid(gridProperties.dimensions);

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
    socket.emit('server ready', { gridArray: grid.gridMatrix });
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
