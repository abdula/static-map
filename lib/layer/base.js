'use strict';
var _ = require('lodash');

function StaticMapLayer(options) {
  this.init(options);
  this._map = null;
}

StaticMapLayer.prototype.setOptions = function(options) {
  this.options = _.extend(this.options || {}, options);
  return this;
};

StaticMapLayer.prototype.getOpt = function(key, defaultVal) {
  return this.options[key] || defaultVal;
};

StaticMapLayer.prototype.getOptions = function() {
  return this.options;
};

StaticMapLayer.prototype.init = function(options) {
  this.setOptions(options);
};

StaticMapLayer.prototype.addTo = function(map) {
  map.addLayer(this);
  return this;
};

StaticMapLayer.prototype.__defineGetter__('map', function() {
  return this._map;
});

StaticMapLayer.prototype.__defineSetter__('map', function(map) {
  this.setMap(map);
});

/**
 *
 * @returns {StaticMap}
 */
StaticMapLayer.prototype.getMap = function() {
  return this._map;
};

StaticMapLayer.prototype.onAdd = function(map) {

};

StaticMapLayer.prototype.setMap = function(map) {
  this._map = map;
  this.onAdd(map);
  return this;
};


StaticMapLayer.prototype.render = function() {
  return Promise.resolve();
};


module.exports = StaticMapLayer;