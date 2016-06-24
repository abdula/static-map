'use strict';

exports.Base          = require('./base-layer');
exports.GeoJSON       = require('./geojson-layer');
exports.Tile          = require('./tile-layer');
exports.Marker        = require('./marker-layer');
exports.FeatureGroup  = require('./feature-group-layer');
exports.Polygon       = require('./polygon-layer');

/**
 *
 * @param {Array} latLngs
 * @returns {PolygonLayer}
 */
exports.polygon = function(latLngs) {
  return new exports.Polygon(latLngs);
};

/**
 *
 * @param options
 * @returns {GeoJSONLayer}
 */
exports.geojson = function(options) {
  return new exports.GeoJSON(options);
};

/**
 *
 * @param options
 * @returns {TileLayer}
 */
exports.tile = function(options){
  return new exports.Tile(options);
};

/**
 *
 * @param options
 * @returns {MarkerLayer}
 */
exports.marker = function(options) {
  return new exports.Marker(options);
};