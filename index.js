var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Gpio = require('onoff').Gpio,
relay1 = new Gpio(17, 'out'),
relay2 = new Gpio(18, 'out');

server.listen(6969);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('relay_1_on', function() {
    relay1.writeSync(1);
    console.log("bật");
    socket.emit("relay_1_oned")
  });
  socket.on('relay_1_off', function() {
    relay1.writeSync(0);
    console.log("tắt")
  });
  socket.on('relay_2_on', function() {
    relay2.writeSync(1);
    console.log("bật")
  });
  socket.on('relay_2_off', function() {
    relay2.writeSync(0);
    console.log("tắt")
  });
});

console.log("Đã khởi động socket server")
