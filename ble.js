var noble = require('noble');
var parser = require('ble-packet');

var ble = {};

ble.start = function() {
  noble.on('stateChange', stateChanged);

  function stateChanged(state) {
    if (state === 'poweredOn') {
      console.log('Starting Scanning');
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
  }
}

ble.getPeripheral = function(callback) {
  noble.on('discover', peripheralDiscovered);

  function peripheralDiscovered(peripheral) {
    console.log('Peripheral Discovered ' + peripheral.uuid);
    callback(peripheral);
  }
}

ble.getMeasurements = function(peripheral, callback) {
  peripheral.connect(function(error) {
    console.log('Device Connected');
    peripheral.discoverServices(['1809'], servicesDiscovered);
  });

  function servicesDiscovered(error, services) {
    var service = services[0];
    console.log('Sevices Discovered ' + service.uuid);
    service.on('characteristicsDiscover', characteristicsDiscovered);
    service.discoverCharacteristics();
  }

  function characteristicsDiscovered(characteristics) {
    characteristic = characteristics[0];
    console.log('Characteristics Discovered ' + characteristic.uuid);
    characteristic.subscribe();
    characteristic.on('data', dataReceived);
  }

  function dataReceived(data, isNotification) {
    console.log('Buffer ' + data);
    var uuidCode = '0x' + characteristic.uuid;
    parser.parse(uuidCode, data, function (err, result) {
      console.log(result);
      callback(result.tempC + "°C");
    });
  }
}

module.exports = ble;
