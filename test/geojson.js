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

    done();
    //var map = createDefaultMap();
    //
    //var polygon = StaticMap.layers.polygon(latLngs);
    //
    //var polygon1 = StaticMap.layers.polygon(latLngs1);
    //polygon1.setStyle('fillStyle', 'red');
    //
    //map
    //  .addLayer(StaticMap.layers.tile())
    //  .addLayer(polygon)
    //  .addLayer(polygon1)
    //  .setWidth(1024)
    //  .setHeight(1024)
    //  .setZoom(13)
    //  .pngStream()
    //  .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_polygon.png'))
    //  .on('finish', done)
    //  .on('error', done);
  });
});
