'use strict';

var _ = require('lodash');
var Canvas = require('canvas');
var Promise = require('bluebird');
//var debug = require('debug')('static-map');
var utils = require('./utils');
var LatLng = require('./latlng');
var PassThrough = require('stream').PassThrough;
var SphericalMercator = require('sphericalmercator');
var Point = require('./point');

var defaultOptions = {
  width: 256,
  height: 256,
  zoom: 8
};

function StaticMap(options) {
  this.layers = [];
  this.options = _.defaults(options, defaultOptions);

  this.merc = new SphericalMercator({
    size: 256
  });

  if (this.options.center) {
    this.setCenter(this.options.center);
  }
}

StaticMap.prototype.setWidth = function(width) {
  this.options.width = width;
  return this;
};

StaticMap.prototype.getWidth = function() {
  return this.options.width;
};

StaticMap.prototype.fitBounds = function(nw, se) {
  nw = this.latLng(nw);
  se = this.latLng(se);

  var minLat = Math.min(nw.lat, se.lat);
  var maxLat = Math.max(nw.lat, se.lat);
  var minLon = Math.min(nw.lng, se.lng);
  var maxLon = Math.max(nw.lng, se.lng);
  var lat = minLat + (maxLat - minLat) / 2;
  var lon = minLon + (maxLon - minLon) / 2;

  let hZoom = 18;
  let vZoom = 18;

  var width = this.getWidth();
  var height = this.getHeight();

  for (; hZoom > 0; hZoom--) {
    if (width * Math.abs(utils.lngToX(maxLon, hZoom) -
        utils.lngToX(minLon, hZoom)) < width) {
      break;
    }
  }

  for (; vZoom > 0; vZoom--) {
    if (height * Math.abs(utils.latToY(maxLat, vZoom) -
        utils.latToY(minLat, vZoom)) < height) {
      break;
    }
  }

  var zoom = Math.min(hZoom, vZoom);
  this.setCenter(this.latLng([lat, lon]));
  this.setZoom(zoom);

  return this;
};

StaticMap.prototype.setHeight = function(height) {
  this.options.height = height;
  return this;
};

StaticMap.prototype.getHeight = function() {
  return this.options.height;
};

StaticMap.prototype.getZoom = function() {
  return this.options.zoom;
};

StaticMap.prototype.setZoom = function(zoom) {
  this.options.zoom = zoom;
  return this;
};

StaticMap.prototype.setCenter = function(center) {
  this.options.center = this.latLng(center);
  return this;
};

StaticMap.prototype.getCenter = function() {
  return this.options.center;
};

StaticMap.prototype.addLayer = function(l) {
  l.map = this;
  if (this.layers.indexOf(l) === -1) {
    this.layers.push(l);
  }
  return this;
};

StaticMap.prototype.hasLayer = function(l) {
  return this.layers.indexOf(l) !== -1;
};

StaticMap.prototype.point = Point.create;

StaticMap.prototype.latLngToPoint = function(latLng, zoom) {
  zoom = zoom === undefined ? this.getZoom() : zoom;
  latLng = this.latLng(latLng);

  var center = utils.latLngToPoint(this.getCenter(), zoom);
  var point = utils.latLngToPoint(latLng, zoom);

  return new Point(
    Math.floor((this.getWidth() / 2) - 256 * (center.x - point.x)),
    Math.floor((this.getHeight() / 2) - 256 * (center.y - point.y))
  );
};


/**
 * @param a
 * @param b
 * @returns {LatLng}
 */
StaticMap.latLng = LatLng.create;
StaticMap.point = Point.create;

StaticMap.prototype.latLng = StaticMap.latLng;


StaticMap.prototype.getCanvas = function() {
  return this.canvas;
};

StaticMap.prototype.render = function() {
  var canvas = new Canvas(this.getWidth(), this.getHeight());
  var ctx = canvas.getContext('2d');

  //ctx.patternQuality = 'bilinear';
  //ctx.antialias = 'default';
  //ctx.filter = 'bilinear';
  //ctx.imageSmoothingEnabled = false;
  //ctx.antialias = 'none';
  //ctx.textDrawingMode = 'glyph';

  this.canvas = canvas;
  this.ctx = ctx;

  var self = this;

  return Promise.each(this.layers, function(l) {
    return l.render(this);
  }).then(function() {
    return {
      map: self,
      canvas: canvas,
      ctx: ctx,
      pngStream: function() {
        return canvas.pngStream();
      }
    };
  });
};


StaticMap.prototype.pngStream = function() {
  var self = this;
  return {
    pipe: function(stream) {
      var pt = new PassThrough();
      var result = pt.pipe(stream);

      self.render()
        .then(function(o) {
          o.pngStream().pipe(pt);
        })
        .catch(function(e) {
          result.emit('error', e);
        });

      return result;
    }
  };
};

module.exports = StaticMap;