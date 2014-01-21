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

  }
}

grid[0][0] = {
  row: 0,
  col: 0,
  color: "#000"
};

/* server startup checks. If any of these fail the server will not run. 
 * the validateData function in order to start the server. 
 */
(function serverTests() {
  //test validateData
  console.log("Startup tests engage");
  var testData = {
    row: 10000,
    col: "notvalid",
    color: "totallynotvalid"
  }
  if(validateData(testData, 32) === true) {
    console.log("FAILED: validateData function is not working properly");
    process.exit(1);
  } else {
    console.log("PASSED: validateData is nominal");
  }
  if(!grid) {
    console.log("FAILED: grid is not instantiated properly");
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
  //Socket listener for user click
  socket.on('clicked', function (data) {
    console.log(data);
    io.sockets.emit('update', data);
  });
});