
var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var port = process.env.PORT || 9001;
server.listen(port);

app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('clicked', function (data) {
    console.log(data);
    io.sockets.emit('update', data);
  });
});