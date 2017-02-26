
var socket = io();
var vm = new Vue({
  el: '#app',
  data: {
    roomData: {},
    ip_config: ""
  },
  created: function() {
    socket.on('response_data', function(data) {
      this.roomData = data;
    }.bind(this));
  }
});
var url = window.location.href;
var arr = url.split("/");
var default_address = arr[0] + "//" + arr[2];
console.log(default_address);
vm.ip_config = default_address;
socket = io.connect(vm.ip_config);

socket.on('connect', function () {
  console.log("Connected");
  socket.emit("request_data")
});

var update_table_light = function() {
  socket.emit("update_table_light") // gửi sự kiện "bật" đến Server
}

var update_fan = function() {
  socket.emit("update_fan") // gửi sự kiện "bật" đến Server
}

var reconnect = function() {
  socket.io.close();
  socket = io.connect(vm.ip_config);
}

var set_ip_config = function() {
  vm.ip_config = vm.ip_config || default_address;
  reconnect()
}
