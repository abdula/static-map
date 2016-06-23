'use strict';

var util = require('util');
var StaticMapLayer = require('./base-layer');
var FeatureGroupLayer = require('./feature-group-layer');
var PolygonLayer = require('./polygon-layer');
var LatLng = require('../latlng');

function GeoJSONLayer(options) {
  StaticMapLayer.call(this, options);
  this.layers = [];
}

GeoJSONLayer.prototype.addData = function( geojson) {
    var features = Array.isArray(geojson) ? geojson : geojson.features,
      i, len, feature;

    if (features) {
      for (i = 0, len = features.length; i < len; i++) {
        // only add this if geometry or geometries are set and not null
        feature = features[i];
        if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
          this.addData(feature);
        }
      }
      return this;
    }

    var options = this.options;

    if (options.filter && !options.filter(geojson)) { return this; }

    var layer = this.geometryToLayer(geojson, options);
    if (!layer) {
      return this;
    }
    layer.feature = this.asFeature(geojson);

    layer.defaultOptions = layer.options;
    this.resetStyle(layer);

    if (options.onEachFeature) {
      options.onEachFeature(geojson, layer);
    }

    return this.addLayer(layer);
};

GeoJSONLayer.prototype.geometryToLayer = function(geojson, options) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
      coords = geometry ? geometry.coordinates : null,
      layers = [], latlngs, i, len;

    if (!coords && !geometry) {
      return null;
    }

    switch (geometry.type) {
      case 'Polygon':
        latlngs = this.coordsToLatLngs(coords, 1);
        return new PolygonLayer(latlngs, options);

      case 'MultiPolygon':
        latlngs = this.coordsToLatLngs(coords, 2);
        return new PolygonLayer(latlngs, options);

      case 'GeometryCollection':
        for (i = 0, len = geometry.geometries.length; i < len; i++) {
          var layer = this.geometryToLayer({
            geometry: geometry.geometries[i],
            type: 'Feature',
            properties: geojson.properties
          }, options);

          if (layer) {
            layers.push(layer);
          }
        }
        var l = new FeatureGroupLayer();
        l.addLayers(layers);
        return l;

      default:
        throw new Error('Invalid GeoJSON object.');
    }
};

GeoJSONLayer.prototype.coordsToLatLng = function (coords) {
  return new LatLng(coords[1], coords[0]);
};

GeoJSONLayer.prototype.coordsToLatLngs = function (coords, levelsDeep) {
  var latlngs = [];

  for (var i = 0, len = coords.length, latlng; i < len; i++) {
    if (levelsDeep) {
      latlng = this.coordsToLatLngs(coords[i], levelsDeep - 1);
    } else {
      latlng = this.coordsToLatLng(coords[i]);
    }
    latlngs.push(latlng);
  }

  return latlngs;
};

GeoJSONLayer.prototype.addLayer = function(l){
  this.layers.push(l);
};

GeoJSONLayer.prototype.init = function(options) {
  this.options = options;
};

util.inherits(GeoJSONLayer, StaticMapLayer);


GeoJSONLayer.prototype.render = function() {
  return Promise.reject(new Error('Not implemented'));
};

module.exports = GeoJSONLayer;