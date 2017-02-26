var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Gpio = require('onoff').Gpio;
var table_light = new Gpio(17, 'out');
var fan = new Gpio(18, 'out');

var roomData = {};

app.set('port', (process.env.PORT || 6969));

app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

io.on('connection', function(socket) {
  socket.on('request_data', function() {
    socket.emit("response_data", roomData)
  });
  socket.on('update_table_light', function() {
    roomData.table_light_status = roomData.table_light_status == 1 ? 0 : 1;
    update_table_light(socket)
  });
  socket.on('update_fan', function() {
    roomData.fan_status = roomData.fan_status == 1 ? 0 : 1;
    update_fan(socket)
  });

  socket.on('disconnect', function() {
    // a user has left our page - remove them from the visitorsData object
  });
});

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});

function update_table_light(socket) {
  table_light.writeSync(roomData.table_light_status);
  socket.emit("response_data", roomData)
}

function update_fan(socket) {
  fan.writeSync(roomData.fan_status);
  socket.emit("response_data", roomData)
}

function set_room_data() {
  roomData = {
    table_light_status: table_light.readSync(),
    fan_status: fan.readSync()
  };
}
