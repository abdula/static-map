'use strict';

/*global describe */

var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;
var path = require('path');
var fs = require('fs');

describe('Marker layer', function() {
  this.timeout(5000);

  it('should render', function(done) {
    var map = createDefaultMap();
    map
      .addLayer(StaticMap.layers.tile())
      .addLayer(StaticMap.layers.marker({
        icon: path.join(__dirname, 'fixtures/red-marker-32.png'),
        latLng: [51.529788, 31.268733]
      }))
      .addLayer(StaticMap.layers.marker({
        icon: path.join(__dirname, 'fixtures/red-marker-32.png'),
        latLng: [51.529788, 31.368733]
      }))
      .addLayer(StaticMap.layers.marker({
        icon: path.join(__dirname, 'fixtures/red-marker-16.png'),
        latLng: [51.539788, 31.268733]
      }))
      .addLayer(StaticMap.layers.marker({
        icon: path.join(__dirname, 'fixtures/red-marker-64.png'),
        latLng: [51.549788, 31.268733]
      }))
      .setWidth(1024)
      .setHeight(1024)
      .setZoom(13)
      .pngStream()
      .pipe(fs.createWriteStream('/tmp/static_map_marker.png'))
      .on('finish', done)
      .on('error', done);
  });
});
