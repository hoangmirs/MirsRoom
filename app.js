var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Gpio = require('onoff').Gpio;
var table_light = new Gpio(17, 'out');
var fan = new Gpio(18, 'out');
var ds18b20 = require('ds18b20');
var interval = 3000;
var roomData = {};

app.set('port', (process.env.PORT || 6969));

app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

io.on('connection', function(socket) {
  // ds18b20.sensors(function (err, id) {
  //   console.log(id);
  //   console.log(err);
  //   roomData.temp.id = id;
  // });
  // setInterval(function () {
  //     ds18b20.temperature(roomData.temp.id, function (err, value) {
  //         //send temperature reading out to connected clients T(°F) = T(°C) × 9/5 + 32
  //         roomData.temp.value = value;
  //         socket.emit("response_data", roomData);
  //     });
  // }, interval);
  set_room_data(socket);
  socket.on('request_data', function() {
    update_roomData(socket);
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
  update_roomData(socket)
}

function update_fan(socket) {
  fan.writeSync(roomData.fan_status);
  update_roomData(socket)
}

function set_room_data(socket) {
  roomData = {
    table_light_status: table_light.readSync(),
    fan_status: fan.readSync()
  };
  update_roomData(socket)
}

function update_roomData(socket) {
  io.sockets.emit("response_data", roomData)
}
