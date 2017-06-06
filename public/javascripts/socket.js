var vue = new Vue({
  el: '.container',
  data: {
    name: '',
    rssi: '',
    level: '',
    manufacturerName: '',
    modelNum: '',
    serialNum: '',
    manufacturerID: '',
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

socket.on("level", function(level) {
  vue.level = level + "%";
});

socket.on("manufacturerName", function(manufacturerName) {
  vue.manufacturerName = manufacturerName;
});

socket.on("modelNum", function(modelNum) {
  vue.modelNum = modelNum;
});

socket.on("serialNum", function(serialNum) {
  vue.serialNum = serialNum;
});

socket.on("manufacturerID", function(manufacturerID) {
  vue.manufacturerID = manufacturerID;
});

socket.on("measurement", function(measurement) {
  vue.measurements.push(measurement + "°C");
});
