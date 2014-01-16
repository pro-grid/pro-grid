var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , path = require('path')

app.listen(1337);

function handler (req, res) {
  fs.readFile(path.join(__dirname, '..', '/index.html'),
  function (err, data) {
    if (err) {
      res.writeHead(500);
      console.log(err);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
