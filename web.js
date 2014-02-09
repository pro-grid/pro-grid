'use strict';

if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

// dependencies
var express = require('express')
  , app = express()
  , async = require('async')
  , uuid = require('node-uuid')
  , validator = require('validator')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
// valid api keys

var gridProperties = {
  dimensions: 32
};

// instantiate grid array
// this happens once per server boot
var grid = [];
for(var y = 0; y < gridProperties.dimensions; y++) {
  grid.push(new Array(gridProperties.dimensions));
  for(var x = 0; x < gridProperties.dimensions; x++) {
    grid[y][x] = {
      row: y,
      col: x,
      color: ''
    };
  }
}

function validateData(data) {
  // yeah so what it's a long return statement why you talkin shit
  var vTypes = validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color);
  var vDimensions = data.row < gridProperties.dimensions && data.col < gridProperties.dimensions;
  var vApiKey = data.apiKey !== undefined && ApiKeyHandler.verify(data.apiKey);
  console.log('Validating data: %s %s %s', vTypes, vDimensions, vApiKey);
  return vTypes && vDimensions && vApiKey;
}

function updateGrid (client, data) {
  var gridCol = grid[data.row][data.col];
  var option = 3;
  switch(option) {
    case 0:
      if(gridCol.color === '') {gridCol.color = data.color;} 
      else { gridCol.color = ''; }
      console.log('updating grid');
      client.broadcast.emit('update', gridCol, function() {console.log('updated grid');});
    break;
    case 1:
      for(var a = 0; a < gridProperties.dimensions; a++) {
        gridCol = grid[data.row][a];
        if(gridCol.color === '') {gridCol.color = data.color;} 
        else { gridCol.color = ''; }
        client.broadcast.emit('update', gridCol, function() {console.log('big');});
      }
    break;
    case 2:
      for(var a = 0; a < gridProperties.dimensions; a++) {
        gridCol = grid[a][data.col];
        if(gridCol.color === '') {gridCol.color = data.color;} 
        else { gridCol.color = ''; }
        client.broadcast.emit('update', gridCol, function() {console.log('big');});
      }
    break;
    case 3:
      gridCol = grid[data.row][data.col]; gridCol.color=data.color;
      gridCol = grid[data.row+1][data.col]; gridCol.color=data.color;
      gridCol = grid[data.row-1][data.col]; gridCol.color=data.color;
      gridCol = grid[data.row][data.col+1]; gridCol.color=data.color;
      gridCol = grid[data.row][data.col-1]; gridCol.color=data.color;
    break;
  }
}

// Store for ApiKeys
var ApiKeys = require('memory-cache');
ApiKeys.debug(true);

// Create, verify, update and delete
// Api Keys
// ApiKeyHandler
var ApiKeyHandler = function (client, key, callback) { // Create
  console.log('called ApiKeyHandler');
  var self = this;
  this.client = client;
  this.clientSession = {};
  this.key = key;
  async.series({
    checkIfExists: function(callback) {
      self.clientSession = ApiKeys.get(client.id);
      callback(!self.clientSession || null);
    },
    throttle: function(callback) {
      var last_check = self.clientSession.createTime;
      var compareTime = process.hrtime(last_check);
      compareTime = (compareTime[0] * 1e9 + compareTime[1]); // convert to nanoseconds
      var rate = 7; // unit: clicks
      var per  = 1000000000; // unit: nanoseconds (1 second)
      self.clientSession.allowance += compareTime * (rate / per);
      console.log('time diff: ' + compareTime);
      if (self.clientSession.allowance > rate) {
        self.clientSession.allowance = rate; // discard extra tokens
      }
      if (self.clientSession.allowance < 1.0) {
        callback("rate limited");
      }
      else {
        self.clientSession.allowance -= 1.0;
        callback(null, self.clientSession.allowance);
      }
      
    }
  },
  function(err, results) {
    console.log('ApiKeyHandler Initialization: \n result: %s \n data: %s', err, JSON.stringify(results));
    if(!err) {
      ApiKeyHandler.newKey(self.client, self.clientSession, callback);
    } else {
      self.client.disconnect();
    }
  });
};

ApiKeyHandler.verify = function(key) {
  return validator.isUUID(key, 4);
};

ApiKeyHandler.newKey = function(client, data, callback) {
  var Client = client.id || client;
  var key = uuid.v4();
  data = (data || {}) // data is optional
  ApiKeys.put(
    Client,
    {
      key: key,
      createTime: process.hrtime(),
      allowance: data.allowance || 7
    },
    3600000); // value sits there for 1 hour if left alone
  console.log('saved');
  if(callback !== undefined) {
    console.log('trying to send fresh api key');
    client.emit('fresh api key', { apiKey: key });
    callback(client);
  }
};

ApiKeyHandler.delete = function(client, callback) {
  ApiKeys.del(client);
  if(callback !== undefined) {
    callback(null, true);
  }
};

// core app logic
var port = process.env.PORT || 9001;
server.listen(port);

app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

// optimizations for production
if(process.env.NODE_ENV === 'production') {

  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 1);
  io.set('transports', [
      'websocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    ]);

}
io.set('log level', 1);

// describe client connection   
io.sockets.on('connection', function (socket) {
  ApiKeyHandler.newKey(socket, null, function (socket) { // DIRTY FIX ME
    console.log('api keys registered:\n' + ApiKeys.size());
    socket.emit('server ready', { gridArray: grid });
    //Socket listener for user click
    socket.on('clicked', function (data) {
      console.log('***\n' + socket.id + ' clicked');
      if(validateData(data)) {
        new ApiKeyHandler(socket, data.apiKey, function() {
          updateGrid(socket, data);
        });
      } else {
        console.warn('warning: user provided invalid data: %s %s %s %s', data.row, data.col, data.color, data.apiKey);
      }
    });
    socket.on('disconnect', function() {
      ApiKeyHandler.delete(socket.id);
      console.log('api keys registered:\n' + ApiKeys.size());
    });
  });
});