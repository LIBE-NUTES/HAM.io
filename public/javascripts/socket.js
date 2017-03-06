var vue = new Vue({
  el: '.container',
  data: {
    name: '',
    rssi: '',
    measurements: []
  }
});

var socket = io.connect("http://localhost:3000");
socket.on("connect", function () {
  console.log("Connected!");
});

socket.on("name", function(name) {
  vue.name = name;
});

socket.on("rssi", function(rssi) {
  vue.rssi = rssi;
});

socket.on("measurement", function(measurement) {
  vue.measurements.push(measurement);
});
