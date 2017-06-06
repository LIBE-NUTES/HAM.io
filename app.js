var express = require('express');
var path = require('path');

var app = express();

var server = require("http").Server(app);
var io = require('socket.io')(server);

var ble = require('./ble.js');
ble.start();

ble.getPeripheral(function(peripheral) {
  io.emit('name', peripheral.advertisement.localName);
  io.emit('rssi', peripheral.rssi);
  ble.updateRssi(peripheral, 5000, function(rssi) {
    // console.log('rssi updated');
    io.emit('rssi', rssi);
  });

  ble.getInfoDevice(peripheral, function(info) {
    var key = Object.keys(info)[0];
    io.emit(key, info[key]);
  });

  // ble.getMeasurements(peripheral, function(measurement) {
  //   io.emit('measurement', measurement);
  // });
  // ble.logInfo(peripheral);
});

app.use(express.static(path.join(__dirname, 'public')));
// front-end dependencies
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/skeleton', express.static(__dirname + '/node_modules/skeleton-css/css/'));

app.use('/', require('./routes/index'));

server.listen(3000);

module.exports = app;
