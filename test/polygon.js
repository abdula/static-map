'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;
var Polygon = StaticMap.layers.Polygon;
var polygons = require('./fixtures/polygons');

var fs = require('fs');

describe('Polygon layer', function() {
  this.timeout(5000);

  it('should exist', function() {
    assert.ok(typeof StaticMap.layers.polygon === 'function');
    assert.ok(typeof StaticMap.layers.Polygon === 'function');
  });

  it('should init', function() {
    var latLngs = polygons.rectangle;
    var polygon = StaticMap.layers.polygon(latLngs);
    assert.ok(polygon instanceof Polygon);
    assert.ok(Array.isArray(polygon.getLatLngs()));
    assert.equal(polygon.getLatLngs().length, latLngs.length);
    assert.ok(polygon.getLatLngs()[0][0] instanceof StaticMap.LatLng);
  });

  it('should render', function(done) {
    var map = createDefaultMap();
    var polygon = StaticMap.layers.polygon(polygons.rectangle);

    var polygon1 = StaticMap.layers.polygon(polygons.pentagon);
    polygon1.setOptions({'fillStyle': 'red'});

    map
      .addLayer(StaticMap.layers.tile())
      .addLayer(polygon)
      .addLayer(polygon1)
      .setWidth(1024)
      .setHeight(1024)
      .setZoom(13)
      .pngStream()
      .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_polygon.png'))
      .on('finish', done)
      .on('error', done);
  });

  /*
   var latlngs = [
   *   [[-111.03, 41],[-111.04, 45],[-104.05, 45],[-104.05, 41]], // outer ring
   *   [[-108.58,37.29],[-108.58,40.71],[-102.50,40.71],[-102.50,37.29]] // hole
   * ];
   */

  it('should render polygon with hole', function(done) {
    var map = createDefaultMap();
    var polygon = StaticMap.layers.polygon(polygons.withHole);
    polygon.setOptions({'fillStyle': 'red', fillOpacity: 0.5});

    map
      .addLayer(StaticMap.layers.tile())
      .addLayer(polygon)
      .setWidth(1024)
      .setHeight(1024)
      .setZoom(13)
      .pngStream()
      .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_polygon_with_hole.png'))
      .on('finish', done)
      .on('error', done);
  });

});
