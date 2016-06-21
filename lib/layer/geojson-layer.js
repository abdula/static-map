'use strict';

var util = require('util');
var StaticMapLayer = require('./base-layer');

function GeoJSONLayer(options) {
  StaticMapLayer.call(this, options);
}

GeoJSONLayer.prototype.init = function(options) {
  this.options = options;
};

util.inherits(GeoJSONLayer, StaticMapLayer);


GeoJSONLayer.prototype.render = function() {
  return Promise.reject(new Error('Not implemented'));
};

module.exports = GeoJSONLayer;