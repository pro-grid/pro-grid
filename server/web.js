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
  dimensions: 32
};

// Get our modules
var ApiKeyHandler = require('./apikeyhandler')
  , clientValidator = require('./clientvalidator')
  , Grid = require('./grid');

var grid = new Grid(gridProperties.dimensions);

// core app logic
var port = process.env.PORT || 9001;
server.listen(port);

app.use(express.static(path.normalize(__dirname +  '/../dist/')));

app.get('/', function (req, res) {
  res.sendfile(path.normalize(__dirname +  '/../dist/index.html'));
});

// optimizations for production
if(process.env.NODE_ENV === 'production') {

  ioServer.enable('browser client minification');
  ioServer.enable('browser client etag');
  ioServer.enable('browser client gzip');
  ioServer.set('log level', 1);
  ioServer.set('transports', [
      'websocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    ]);

}
ioServer.set('log level', 1);

// describe client connection   
ioServer.sockets.on('connection', function (socket) {
  ApiKeyHandler.newKey(socket, null, function (socket) { // DIRTY FIX ME
    console.log('api keys registered:\n' + ApiKeyHandler.ApiKeys.size());
    socket.emit('server ready', { gridArray: grid });
    //Socket listener for user click
    socket.on('clicked', function (data) {
      console.log('***\n' + socket.id + ' clicked');
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
      console.log('api keys registered:\n' + ApiKeyHandler.ApiKeys.size());
    });
  });
});