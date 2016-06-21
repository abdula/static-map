'use strict';

exports.lngToX = function(lon, zoom) {
  return ((lon + 180) / 360) * Math.pow(2, zoom);
};

exports.latToY = function (lat, zoom) {
  return (1 - Math.log(Math.tan(lat * Math.PI / 180) +
      1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
};

exports.latLngToPoint = function(latLng, zoom) {
  return {y: exports.latToY(latLng.lat, zoom), x: exports.lngToX(latLng.lng, zoom)};
};