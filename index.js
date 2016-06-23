'use strict';

var StaticMap = require('./lib/static-map');

function Facade(options) {
  return new StaticMap(options);
}

Facade.Map    = StaticMap;
Facade.point  = require('./lib/point').create;
Facade.latLng = require('./lib/latlng').create;
Facade.layers = require('./lib/layer/index');


module.exports = Facade;