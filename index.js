'use strict';

var StaticMap = require('./lib/static-map');
var LatLng = require('./lib/latlng');
var LatLngBounds = require('./lib/latlng-bounds');
var Point = require('./lib/point');
var layers = require('./lib/layer/index');

function Facade(options) {
  return new StaticMap(options);
}

Facade.Map    = StaticMap;
Facade.Point  = Point;
Facade.point  = Point.create;
Facade.LatLng = LatLng;
Facade.latLng = LatLng.create;
Facade.LatLngBounds = LatLngBounds;
Facade.latLngBounds = LatLngBounds.create;

Facade.layers = layers;


module.exports = Facade;