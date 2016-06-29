'use strict';

var util = require('util');
var StaticMapLayer = require('./base');
var Promise = require('bluebird');
var LatLng = require('../latlng');
var LatLngBounds = require('../latlng-bounds');
var _ = require('lodash');
var Canvas = require('canvas');

var _defaultOptions = {
  fillStyle: 'rgba(128, 128, 255, 0.5)',
  strokeStyle: 'rgba( 26, 26, 153, 0.5)',
  lineWidth: 1,
  lineJoin: 'round'
};

function PolygonLayer(latLngs, options) {
  StaticMapLayer.call(this, _.defaults(options || {}, _defaultOptions));

  this._latlngs = [];

  if (Array.isArray(latLngs)) {
    this.setLatLngs(latLngs);
  }
}

util.inherits(PolygonLayer, StaticMapLayer);


PolygonLayer.prototype._project = function () {
  this._rings = [];
  this._projectLatlngs(this._latlngs, this._rings);
  this._parts = this._rings;
};


PolygonLayer.prototype._getBounds = function(latlngs, bounds) {
  var flat = latlngs[0] instanceof LatLng,
    len = latlngs.length,
    i;

  if (flat) {
    for (i = 0; i < len; i++) {
      bounds.extend(latlngs[i]);
    }
  } else {
    for (i = 0; i < len; i++) {
      this._getBounds(latlngs[i], bounds);
    }
  }
};

PolygonLayer.prototype.getBounds = function () {
  var bounds = new LatLngBounds();
  this._getBounds(this._latlngs, bounds);
  return bounds;
};

PolygonLayer.prototype._projectLatlngs = function (latlngs, result) {
  var flat = latlngs[0] instanceof LatLng,
    len = latlngs.length,
    i, ring;
  var map = this.getMap();

  if (flat) {
    ring = [];
    for (i = 0; i < len; i++) {
      ring[i] = map.latLngToPoint(latlngs[i]);
    }
    result.push(ring);
  } else {
    for (i = 0; i < len; i++) {
      this._projectLatlngs(latlngs[i], result);
    }
  }
};

PolygonLayer.prototype.render = function() {
  var i, j, len2, p, parts, len;
  this._project();

  parts = this._parts;
  len = parts.length;

  if (!len) { return; }
  var canvas = this.getMap().createContainer();
  var ctx = canvas.getContext('2d');

  ctx.save();
  ctx.beginPath();

  for (i = 0; i < len; i++) {

    for (j = 0, len2 = parts[i].length; j < len2; j++) {
      p = parts[i][j];
      ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
    }
    ctx.closePath();
  }

  var options = this.getOptions();
  ctx.globalCompositeOperation = 'source-over';
  if (options.fillStyle) {
    ctx.globalAlpha = options.fillOpacity;
    ctx.fillStyle = options.fillStyle;
    ctx.fill(options.fillRule || 'evenodd');
  }

  if (options.strokeStyle) {
    ctx.globalAlpha = options.opacity;
    ctx.strokeStyle = options.strokeStyle;
    ctx.lineWidth = options.lineWidth;
    ctx.stroke();
  }
  //ctx.globalCompositeOperation = 'source-over';//clear ? 'destination-out' : 'source-over';
  ctx.restore();
  this.getMap().ctx.drawImage(canvas, 0, 0);



  return Promise.resolve();
};

PolygonLayer.prototype.setStyle = function(key, value) {

  if (typeof key === 'object') {
    this.setOptions(key);
  } else {
    var obj = {};
    obj[key] = value;
    this.setOptions(obj);
  }
  return this;
};

PolygonLayer.prototype.getLatLngs = function () {
  return this._latlngs;
};

PolygonLayer.prototype._flat = function (latlngs) {
  return !Array.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
};

PolygonLayer.prototype._convertLatLngs = function(latlngs) {
  var result = [];
  var flat = this._flat(latlngs);

  for (var i = 0, len = latlngs.length; i < len; i++) {
    if (flat) {
      result[i] = LatLng.create(latlngs[i]);
    } else {
      result[i] = this._convertLatLngs(latlngs[i]);
    }
  }

  return result;
};

PolygonLayer.prototype.setLatLngs = function (latlngs) {
  this._latlngs = this._convertLatLngs(latlngs);
};

module.exports = PolygonLayer;