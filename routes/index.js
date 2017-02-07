var express = require('express');
var router = express.Router();
var path = require('path');

var rootPath = path.resolve('.');

router.get('/', function(req, res) {
  res.sendFile(rootPath + '/views/index.html');
});

module.exports = router;
