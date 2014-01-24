'use strict';

if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

// dependencies
var express = require('express')
  , app = express()
  , async = require('async')
  , crypto = require('crypto')
  , validator = require('validator')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
// grid dimensions
var gridDimensions = 32;
// valid api keys
var apiKeys = [];

// instantiate grid array
// this happens once per server boot
var grid = [];
for(var y = 0; y < gridDimensions; y++) {
  grid.push(new Array(gridDimensions));
  for(var x = 0; x < gridDimensions; x++) {
    grid[y][x] = {
      row: y,
      col: x,
      color: ''
    };
  }
}

function validateData(data) {
  // yeah so what it's a long return statement why you talkin shit
  return validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color) && data.row < data.dimensions && data.col < data.dimensions && data.apiKey;
}

function validateApiKey (key) {
  return key && typeof key === 'string' && key.toString().length === 96 && validator.isHexadecimal(key);
}

function validateTimeApiKey (keyObj, callback) {
  // if the time between api keys is less than 100ms
  var compareTime = process.hrtime(keyObj.time);
  compareTime = (compareTime[0] * 1e9 + compareTime[1]);
  console.log('time: ' + compareTime);
  callback(compareTime > 100000000);
}

function removeApiKey (key, callback) {
  console.log('trying to remove api key');
  apiKeys.splice(apiKeys.indexOf(key));
  callback();
}

function addApiKey (key, callback) {
  apiKeys.push(key);
  if (typeof(callback) !== 'undefined') {
    callback();
  }
}

function generateApiKey (socket, unwind) {
  crypto.randomBytes(48, function(ex, buf) {
    if (ex) {
      throw ex;
    }
    var key = {
      client: socket.id,
      apiKey: buf.toString('hex'),
      time: process.hrtime()
    };
    console.log('socket: ' + socket.id + ' key: ' + JSON.stringify(key));
    socket.set('apiKey', key, function() {
      console.log(key);
      socket.emit('fresh api key', { apiKey: key.apiKey });
      addApiKey(key);
      unwind();
    });
  });
}


function checkApiKey (key, next) {
  var unwind = next;
  console.log('check this key ' + key + '\nagainst ' + JSON.stringify(apiKeys) + '\n\n');
  console.log('trying');
  async.detect(
    apiKeys,
    function (item, callback) {
      callback(item.apiKey === key);
    },
    function (result) {
      if(result !== undefined) {
        removeApiKey(result, function () {
          validateTimeApiKey(result, function (result) {
            if(result) {
              unwind(null, true);
            } else {
              unwind('you are clicking 2fast2furious : rate limit error', false);
            }
          });
          
        });
      } else {
        unwind('check api failed');
      }
    });
}

function updateGrid (data, socket) {
  var gridCol = grid[data.row][data.col];
  generateApiKey(socket, function () {
    if(gridCol.color === '') {
      gridCol.color = data.color;
    } else {
      gridCol.color = '';
    }
    socket.broadcast.emit('update', gridCol);
  });
}

// run the server tests
// require('./server-tests.js');

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
  generateApiKey(socket, function () {
    console.log('api keys registered:\n' + apiKeys.length);
    socket.emit('server ready', { gridArray: grid });
    //Socket listener for user click
    socket.on('clicked', function (data) {
      data.dimensions = gridDimensions;
      async.series({
        verifyData: function(callback) {
          if(validateData(data)) {
            callback(null, true);
          } else {
            callback('data validation did not pass');
          }
        },
        verifyApi: function(callback) {
          if(validateApiKey(data.apiKey)) {
            callback(null, true);
          } else {
            callback('not a valid key format');
          }
        },
        matchApi: function(callback) {
          checkApiKey(data.apiKey, callback);
        },
        updateGrid: function(callback) {
          updateGrid(data, socket);
          callback(null, true);
        }
      },
      function(err, results) {
        console.log(JSON.stringify(results));
        if(err) {
          console.log('error: ' + err);
          socket.emit('naughty', { message: 'goodbye'});
          socket.disconnect();
        }
      });
    });

    socket.on('disconnect', function() {
      socket.get('apiKey', function(err, key) {
        removeApiKey(key, function () {
          console.log('removed api key');
        });
      });
    });
  });
});