'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;

var fs = require('fs');

describe('Static map', function() {
  this.timeout(5000);

  it('should use default options', function() {
    var map = new StaticMap();

    assert.equal(map.getWidth(), 256);
    assert.equal(map.getHeight(), 256);
  });

  it('should set width', function() {
    var map = new StaticMap();

    assert.equal(map.setWidth(500).getWidth(), 500);
  });

  it('should set height', function() {
    var map = new StaticMap();
    assert.equal(map.setHeight(500).getHeight(), 500);
  });


  it('should set center', function() {
    var map = new StaticMap();
    map.setCenter([51.498200, 31.289350]);

    assert.equal(map.getCenter().lat, 51.498200);
    assert.equal(map.getCenter().lng, 31.289350);
  });

  it('should set zoom', function() {
    var map = new StaticMap();
    assert.ok(map.getZoom() > 0);
    assert.equal(map.setZoom(5).getZoom(), 5);
  });

  it('should create tileLayer', function() {
    var tileLayer = StaticMap.layers.tile({});

    assert.equal(tileLayer.tileSize, 256);
    assert.equal(tileLayer.tileUrl, 'http://tile.openstreetmap.org/{z}/{x}/{y}.png');
  });

  it('should add layer', function() {
    var map = new StaticMap();
    var tileLayer = StaticMap.layers.tile({});
    map.addLayer(tileLayer);

    assert.equal(tileLayer.getMap(), map);
    assert.ok(map.hasLayer(tileLayer));
  });

  it('should render blank png', function(done) {
    var map = createDefaultMap();

    map
      .pngStream()
      .pipe(fs.createWriteStream('/tmp/map_blank.png'))
      .on('finish', done)
      .on('error', done);
  });
});