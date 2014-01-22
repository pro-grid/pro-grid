/******************************************************
*                  SERVER INITIALIZATION              *
******************************************************/

// NewRelic is required if the production env is Heroku
if(process.env.NEW_RELIC_APP_NAME) {
  require('newrelic');
}

var gridDimensions = 32;
var express = require('express');
var validator = require('validator');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// Setup port for frontend usage
var port = process.env.PORT || 9001;
server.listen(port);

app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});



/******************************************************
*                   DATA INITIALIZATION               *
******************************************************/

// Instantiate an empty grid
var grid = [];
for(var y = 0; y < gridDimensions; y++) {
  grid.push(new Array(gridDimensions));
  for(var x = 0; x < gridDimensions; x++) {
    grid[y][x] = {
      row: y,
      col: x,
      color: ""
    };
  }
}



/******************************************************
*                   DATA VALIDATION                   *
******************************************************/

// Check grid cell is valid, within dimensions, and the submitted color is valid
function validateData(data, dimensions) {
  return validator.isInt(data.row) &&
    validator.isInt(data.col) &&
    validator.isHexColor(data.color) &&
    data.row < dimensions &&
    data.col < dimensions;
}

/*
 * Server Startup Checks.
 *
 * If any of these fail the server will not run.
 * the validateData function in order to start the server.
 */
(function serverTests() {
  //test validateData
  console.log("info: Startup tests engage");

  var testData = {
    row: 10000,
    col: "notvalid",
    color: "totallynotvalid"
  }
  if(validateData(testData, 32) === true) {
    console.error("FAILED: validateData function is not working properly");
    process.exit(1);
  } else {
    console.log("PASSED: validateData is nominal");
  }

  if(!grid) {
    console.error("FAILED: grid is not instantiated properly");
    process.exit(1);
  } else {
    console.log("PASSED: grid instantiation nominal");
  }

}());



/******************************************************
*                SOCKET COMMUNICATION                 *
******************************************************/

// Called whenever a new socket connection is formed by client
io.sockets.on('connection', function (socket) {
  // Send current state of grid
  socket.emit('server ready', { gridArray: grid });

  // Received whenever user clicks a tile on the frontend
  socket.on('clicked', function (data) {

    // Grab last_updated_at to check 100ms have passed since last update
    socket.get('last_updated_at', function(err, timestamp) {
      current_datetime = (new Date().getTime() / 1000);
      if (timestamp && ((current_datetime - timestamp) <= 0.100)) {

        // Increment the invalid update counter
        socket.get('invalid_updates', function( err, invalid_updates) {
          socket.set('invalid_updates', ((!invalid_updates) ? 1 : invalid_updates + 1));
        });
        socket.emit('naughty', { message: "must wait 100ms between update requests" });

      // Valid update request time, verify validity
      } else {
        // Change color of grid cell if a valid change
        if (validateData(data, gridDimensions)) {
          var gridCol = grid[data.row][data.col];

          // If colored, make blank (white). Otherwise, make blank cell player's color
          if(gridCol.color == '') {
            gridCol.color = data.color;
          } else {
            gridCol.color = '';
          }

          // Set current update time BEFORE broadcast
          last_updated_at = (new Date().getTime() / 1000);
          socket.set('last_updated_at', last_updated_at);

          // Reset invalid updates counter
          socket.set('invalid_updates', 0);

          // Broadcast the color update to all connections other than sender
          socket.broadcast.emit('update', gridCol);
        } else {
          // Invalid update request, respond to connection with error message
          socket.emit('naughty', { message: "data validation did not pass"});
        }
      }
    });
  });
});