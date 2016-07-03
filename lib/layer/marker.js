'use strict';

var util = require('util');
var StaticMapLayer = require('./base');
var _ = require('lodash');
var Canvas = require('canvas');
var fs = require('fs');
var LatLng = require('../latlng');
var Promise = require('bluebird');
var defaultOptions = {};

var icons = {};

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
  return this.getMap().latLngToPoint(this.getLatLng());
};

MarkerLayer.prototype._createIcon = function() {
  var icon = this.options.icon;

  return new Promise(function(resolve, reject) {
    if (typeof icon === "string") {
      if (icons[icon]) {
        return resolve(icons[icon]);
      }

      fs.readFile(icon, function(err, squid) {
        if (err) {
          return reject(err);
        }
        icons[icon] = squid;
        return resolve(squid);
      });
    } else {
      return resolve(icon);
    }
  }).then(function(squid) {
    var img = new Canvas.Image();
    img.src = squid;
    return img;
  });
};

MarkerLayer.prototype.render = function() {
  var map = this.getMap();
  var point = this.getPoint();

  return this._createIcon()
    .then(function(icon) {
      map.ctx.drawImage(icon, point.x, point.y);
    });
};


module.exports = MarkerLayer;