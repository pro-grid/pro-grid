var gridDimensions = 32;
var express = require('express');
var validator = require('validator');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);


function validateData(data, dimensions) {
  // yeah so what it's a long return statement why you talkin shit
  return validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color) && data.row < dimensions && data.col < dimensions;
}

// instantiate grid array
// this happens once per server boot
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

/* server startup checks. If any of these fail the server will not run. 
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


var port = process.env.PORT || 9001;
server.listen(port);

app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('server ready', { gridArray: grid });
  //Socket listener for user click
  socket.on('clicked', function (data) {
    if(validateData(data, gridDimensions)) {
      var gridCol = grid[data.row][data.col];
      if(gridCol.color == '') {
        gridCol.color = data.color;
      } else {
        gridCol.color = '';
      }
      io.sockets.emit('update', gridCol);
    } else {
      socket.emit('naughty', { message: "data validation did not pass"});
    }
  });
});