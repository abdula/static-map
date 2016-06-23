'use strict';

exports.BaseLayer          = require('./base-layer');
exports.GeoJSONLayer       = require('./geojson-layer');
exports.TileLayer          = require('./tile-layer');
exports.MarkerLayer        = require('./marker-layer');
exports.FeatureGroupLayer  = require('./feature-group-layer');
exports.PolygonLayer       = require('./polygon-layer');

exports.polygon = function(latLngs) {
  return new exports.PolygonLayer(latLngs);
};

exports.geojson = function(options) {
  return new exports.GeoJSONLayer(options);
};

exports.tile = function(options){
  return new exports.TileLayer(options);
};

exports.marker = function(options) {
  return new exports.MarkerLayer(options);
};