'use strict';

if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

// dependencies
var express = require('express')
  , app = express()
  , async = require('async')
  , crypto = require('crypto')
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

function validateData(data, callback) {
  // yeah so what it's a long return statement why you talkin shit
  var vTypes = validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color);
  var vDimensions = data.row < gridProperties.dimensions && data.col < gridProperties.dimensions;
  var vApiKey = data.apiKey !== undefined;
  console.log("Validating data: %s %s %s", vTypes, vDimensions, vApiKey);
  return vTypes && vDimensions && vApiKey;
}

function updateGrid (client, data, callback) {
  var gridCol = grid[data.row][data.col];
  if(gridCol.color === '') {
    gridCol.color = data.color;
  } else {
    gridCol.color = '';
  }
  console.log('updating grid');
  client.broadcast.emit('update', gridCol, function() {
    console.log('updated grid');
  });
}

// Store for ApiKeys
var ApiKeys = require('memory-cache');
ApiKeys.debug(true);

// Create, verify, update and delete
// Api Keys
// ApiKeyHandler
var ApiKeyHandler = function (client, key, callback) { // Create
  console.log("called ApiKeyHandler");
  var self = this;
  this.client = client;
  this.key = key;
  async.series({
    verifyKey: function(callback) {
      if(ApiKeyHandler.verify) {
        callback(null, "valid");
      } else {
        callback("key is not valid");
      }
    },
    checkIfExists: function(callback) {
      ApiKeyHandler.query(ApiKeys.get(self.client.id), callback);
    }
  },
  function(err, results) {
    console.log('ApiKeyHandler Initialization: \n passed: %s \n results: %s', !err, JSON.stringify(results));
    if(!err) {
      ApiKeyHandler.newKey(self.client, callback);
    }
  });
}

ApiKeyHandler.verify = function() {
  return validator.isUUID(this.key, 4);
};

ApiKeyHandler.query = function(data, callback) {
  if(!!data) {
    console.log("found %s", data.key)
    callback(null, "found the api key");
  } else {
    callback("failed to find api key");
  }
};

ApiKeyHandler.newKey = function(client, callback) {
  var Client = client.id || client;
  var key = uuid.v4();
  ApiKeys.put(
    Client,
    {
      key: key,
      createTime: process.hrtime()
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
  ApiKeyHandler.newKey(socket, function (socket) { // DIRTY FIX ME
    console.log('api keys registered:\n' + ApiKeys.size());
    socket.emit('server ready', { gridArray: grid });
    //Socket listener for user click
    socket.on('clicked', function (data) {
      console.log('***\n' + socket.id + " clicked");
      if(validateData(data)) {
        var genApiKey = new ApiKeyHandler(socket, data.apiKey, function() {
          updateGrid(socket, data)
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