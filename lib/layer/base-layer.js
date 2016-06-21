'use strict';

function StaticMapLayer(options) {
  this.init(options);
  this._map = null;
}

StaticMapLayer.prototype.init = function(options) {
  this.options = options;
};

StaticMapLayer.prototype.addTo = function(map) {
  map.addLayer(this);
  return this;
};

StaticMapLayer.prototype.__defineGetter__('map', function() {
  return this._map;
});

StaticMapLayer.prototype.__defineSetter__('map', function(map) {
  this._map = map;
});

/**
 *
 * @returns {StaticMap}
 */
StaticMapLayer.prototype.getMap = function() {
  return this._map;
};

StaticMapLayer.prototype.setMap = function(map) {
  this._map = map;
  return this;
};


StaticMapLayer.prototype.render = function() {
  return Promise.resolve();
};


module.exports = StaticMapLayer;