var express = require('express');
var path = require('path');
var noble = require('noble');
var util = require('util');
var blePacket = require('ble-packet');

var app = express();

var server = require("http").Server(app);
var io = require('socket.io')(server);

function stateChanged(state) {
  if (state === 'poweredOn') {
    console.log('Starting Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
}

function discoveredPeripheral(peripheral) {
  console.log('Peripheral Discovered');
  io.emit('name', peripheral.advertisement.localName);
  io.emit('rssi', peripheral.rssi);
  peripheral.connect(function (error) {
    console.log('Device Connected');
    peripheral.discoverServices(['1809'], discoveredSer);
  });
}

function discoveredSer(error, services) {
  console.log('Sevices Discovered');
  services[0].once('characteristicsDiscover', discoveredChar);
  services[0].discoverCharacteristics();
}

function discoveredChar(characteristics) {
  console.log('Characteristics Discovered');
  characteristics[0].notify(true);

  characteristics[0].on('data', function(data, isNotification) {
    blePacket.parse('0x2a1c', data, function (err, result) {
      io.emit('measurement', result.tempC)
    });
  });
}

noble.on('stateChange', stateChanged);
noble.on('discover', discoveredPeripheral);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist/'));

app.use('/', require('./routes/index'));

server.listen(3000);

module.exports = app;
