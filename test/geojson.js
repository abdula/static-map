'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');

var fs = require('fs');
var accessToken = '';

describe('Geojson layer', function() {
  this.timeout(20000);

  it('should exist', function() {
    assert.ok(typeof StaticMap.layers.geojson === 'function');
    assert.ok(typeof StaticMap.layers.GeoJSON === 'function');
  });

  //it('should render', function(done) {
  //  var geojson = StaticMap.layers.geojson({});
  //  geojson.addData(require('./fixtures/geojson.json'));
  //
  //  var map = createDefaultMap();
  //
  //  map
  //    .addLayer(StaticMap.layers.tile({
  //      tileUrl: 'https://b.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + accessToken
  //    }))
  //    .addLayer(geojson)
  //    .setWidth(1024)
  //    .setHeight(1024)
  //    .setZoom(15)
  //    .pngStream()
  //    .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_geojson.png'))
  //    .on('finish', done)
  //    .on('error', done);
  //});

  it('should render county', function(done) {
    var geojson = StaticMap.layers.geojson({style: function(l) {
      return {
        //lineWidth: 10,
        strokeStyle: 'blue',
        fillOpacity: 0.3,
        fillStyle: 'red'
      };
    }});
    geojson.addData(require('./fixtures/washington.json'));

    var map = new StaticMap();
    map//.setCenter([45.0363189483057, -67.6361015234257])
      .setWidth(1024)
      .setHeight(1024)
      .fitBounds(StaticMap.latLng([44.394078, -68.1060180659999]), StaticMap.latLng([45.6889038090001, -66.949831]));

    //console.log(map.getCenter());
    //console.log(map.getZoom());

    //map.setZoom(15);
    map.addLayer(StaticMap.layers.tile({
      tileUrl: 'https://b.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + accessToken
    }))
      .addLayer(StaticMap.layers.marker({latLng: [44.394078, -68.1060180659999]}))
      .addLayer(StaticMap.layers.marker({latLng: [45.6889038090001, -66.949831]}))
      .addLayer(geojson)
      .pngStream()
      .on('error', done)
      .pipe(fs.createWriteStream(common.tmpDir() + '/static_map_geojson1.png'))
      .on('finish', done)
      .on('error', done);
  });

});
