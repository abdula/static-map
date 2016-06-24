'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;

var fs = require('fs');

describe('Marker layer', function() {
  this.timeout(5000);

  it('should render', function(done) {
    var map = createDefaultMap();
    map
      .addLayer(StaticMap.layers.tile())
      .addLayer(StaticMap.layers.marker({latLng: [51.529788, 31.268733]}))
      .setWidth(1024)
      .setHeight(1024)
      .setZoom(13)
      .pngStream()
      .pipe(fs.createWriteStream('/tmp/static_map_marker.png'))
      .on('finish', done)
      .on('error', done);
  });
});
