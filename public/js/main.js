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

socket.on('response_pir', function (value) {
  console.log("PIR: " + value);
  sayGreeting(value);
});

var sayGreeting = function(value) {
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[5];
  msg.volume = 1; // 0 to 1
  if (value == 1) {
    msg.text = 'Xin chao';
  } else {
    msg.text = 'Hahaha';
  }

  msg.lang = 'en-US';

  msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
  };

  speechSynthesis.speak(msg);
}

var update_table_light = function() {
  socket.emit("update_table_light")
}

var update_fan = function() {
  socket.emit("update_fan")
}

var update_greeting = function() {
  socket.emit("update_greeting")
}

var reconnect = function() {
  socket.io.close();
  socket = io.connect(vm.ip_config);
}

var set_ip_config = function() {
  vm.ip_config = vm.ip_config || default_address;
  reconnect()
}
