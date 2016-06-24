'use strict';

var StaticMap = require('./lib/static-map');
var LatLng = require('./lib/latlng');
var Point = require('./lib/point');

function Facade(options) {
  return new StaticMap(options);
}

Facade.Map    = StaticMap;
Facade.point  = Point.create;
Facade.latLng = LatLng.create;
Facade.Point  = Point;
Facade.LatLng = LatLng;
Facade.layers = require('./lib/layer/index');


module.exports = Facade;