'use strict';

var StaticMap = require('../index');
var os = require('os');

exports.createDefaultMap = function() {
  var map = new StaticMap();
  map
    .setZoom(6)
    .setCenter([51.498200, 31.289350])
    .setWidth(256)
    .setHeight(256);

  return map;
};

exports.tmpDir = function() {
  return os.tmpdir();
};