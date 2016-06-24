'use strict';

exports.Base          = require('./base');
exports.GeoJSON       = require('./geojson');
exports.Tile          = require('./tile');
exports.Marker        = require('./marker');
exports.FeatureGroup  = require('./feature-group');
exports.Polygon       = require('./polygon');

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