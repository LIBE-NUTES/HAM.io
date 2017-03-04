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

  ble.getMeasurements(peripheral, function(measurement) {
    io.emit('measurement', measurement);
  });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist/'));

app.use('/', require('./routes/index'));

server.listen(3000);

module.exports = app;
