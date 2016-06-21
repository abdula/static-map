'use strict';

var util = require('util');
var utils = require('../utils');
var StaticMapLayer = require('./base-layer');
var _ = require('lodash');
var Canvas = require('canvas');
var fs = require('fs');
var LatLng = require('../latlng');

var defaultOptions = {};

function MarkerLayer(options) {
  StaticMapLayer.call(this, options);
}

util.inherits(MarkerLayer, StaticMapLayer);

MarkerLayer.prototype.init = function(options) {
  this.options = _.defaults(options, defaultOptions);
  this.setLatLng(this.options.latLng);
};

MarkerLayer.prototype.setLatLng = function(latLng) {
  this.options.latLng = LatLng.create(latLng);
};

MarkerLayer.prototype.getLatLng = function() {
  return this.options.latLng;
};

MarkerLayer.prototype.getPoint = function() {
  var map = this.map;
  var zoom = map.getZoom();
  var center = utils.latLngToPoint(map.getCenter(), zoom);
  var point = utils.latLngToPoint(this.getLatLng(), zoom);

  return {
    x: Math.floor((map.getWidth() / 2) - 256 * (center.x - point.x)),
    y: Math.floor((map.getHeight() / 2) - 256 * (center.y - point.y))
  };
};


MarkerLayer.prototype.render = function() {
  var map = this.getMap();

  var point = this.getPoint();

  return new Promise(function(resolve, reject) {
    fs.readFile(__dirname + '/markers/red-marker-32.png', function(err, squid){
      if (err) {
        return reject(err);
      }

      var img = new Canvas.Image();
      img.src = squid;
      map.ctx.drawImage(img, point.x, point.y);
      resolve();
    });
  });
};


module.exports = MarkerLayer;