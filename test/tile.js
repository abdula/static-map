'use strict';

/*global describe */

var assert = require('assert');
var StaticMap = require('../index');
var common = require('./common');
var createDefaultMap = common.createDefaultMap;

var fs = require('fs');

describe('Tile Layer', function() {
  this.timeout(5000);

  it('should render', function(done) {
    var map = createDefaultMap();
    map.addLayer(StaticMap.layers.tile())
      .setWidth(400)
      .setHeight(400)
      .setZoom(5)
      .pngStream()
      .pipe(fs.createWriteStream('/tmp/map_tile.png'))
      .on('finish', done)
      .on('error', done);
  });
});

