'use strict';

var util = require('util');
var StaticMapLayer = require('./base');
var LatLngBounds = require('../latlng-bounds');

function FeatureGroupLayer(options) {
  StaticMapLayer.call(this, options);
  this._layers = [];
}

util.inherits(FeatureGroupLayer, StaticMapLayer);

FeatureGroupLayer.prototype.getBounds = function() {
    var bounds = new LatLngBounds();

    for (var id in this._layers) {
      var layer = this._layers[id];
      bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
    }
    return bounds;
};

FeatureGroupLayer.prototype.setStyle = function(style) {
  return this.invoke('setStyle', style);
};

FeatureGroupLayer.prototype.eachLayer = function (method, context) {
  for (var i in this._layers) {
    method.call(context, this._layers[i]);
  }
  return this;
};

FeatureGroupLayer.prototype.invoke = function (methodName) {
  var args = Array.prototype.slice.call(arguments, 1),
    i, layer;

  for (i in this._layers) {
    layer = this._layers[i];

    if (layer[methodName]) {
      layer[methodName].apply(layer, args);
    }
  }

  return this;
};

FeatureGroupLayer.prototype.addLayers = function(list){
  list.forEach(this.addLayer, this);
};

FeatureGroupLayer.prototype.addLayer = function(l){
  this._layers.push(l);

  var map = this.getMap();
  if (map) {
    map.addLayer(l);
  }
};

FeatureGroupLayer.prototype.getLayers = function() {
  var layers = [];

  for (var i in this._layers) {
    layers.push(this._layers[i]);
  }
  return layers;
};

FeatureGroupLayer.prototype.onAdd = function(map) {
  for (var i in this._layers) {
    map.addLayer(this._layers[i]);
  }
};

FeatureGroupLayer.prototype.init = function(options) {
  this.options = options;
};


module.exports = FeatureGroupLayer;