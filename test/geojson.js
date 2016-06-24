'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;

var fs = require('fs');

describe('Geojson layer', function() {

  it('should exist', function() {
    assert.ok(typeof StaticMap.layers.geojson === 'function');
    assert.ok(typeof StaticMap.layers.GeoJSON === 'function');
  });

  it('should render', function(done) {
    var geojson = StaticMap.layers.geojson({});
    geojson.addData(require('./fixtures/geojson.json'));

    var map = createDefaultMap();

    map
      .addLayer(StaticMap.layers.tile())
      .addLayer(geojson)
      .setWidth(1024)
      .setHeight(1024)
      .setZoom(13)
      .pngStream()
      .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_geojson.png'))
      .on('finish', done)
      .on('error', done);
  });
});
