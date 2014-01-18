var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9001);

function handler (req, res) {
  //lol
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('clicked', function (data) {
    console.log(data);
    io.sockets.emit('update', data);
  });
});