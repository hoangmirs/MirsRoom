var socket = io.connect('http://192.168.1.7:6969');
var vm = new Vue({
  el: '#app',
  data: {
    roomData: {}
  },
  created: function() {
    socket.on('response_data', function(data) {
      this.roomData = data;
    }.bind(this));
  }
});
socket.on('connect', function () {
  console.log("Đã kết nối tới socket server");
  socket.emit("request_data")
});

var update_table_light = function() {

  socket.emit("update_table_light") // gửi sự kiện "bật" đến Server
}

var update_fan = function() {
  socket.emit("update_fan") // gửi sự kiện "bật" đến Server
}
