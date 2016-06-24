'use strict';

var util = require('util');
var StaticMapLayer = require('./base');
var _ = require('lodash');
var axios = require('axios');
var debug = require('debug')('tile-layer');
var Promise = require('bluebird');
var utils = require('../utils');
var Canvas = require('canvas');

var defaultOptions = {
  tileUrl: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileSize: 256,
  attempts: 2
};


function fetch(url, remainingAttempts, callback) {
  debug('fetch', url);
  axios.get(url, {responseType: 'arraybuffer'})
    .then(function(res){
      callback(null, res.data);
    })
    .catch(function(res){
      if (res instanceof Error) {
        debug(res);
        if (--remainingAttempts > 0) {
          fetch(url, remainingAttempts, callback);
        } else {
          callback(res);
        }
      } else {
        debug(res.status);
        callback(new Error(res.status));
      }
    });
}

function TileLayer(options) {
  StaticMapLayer.call(this, options);
}

TileLayer.prototype.init = function(options) {
  this.options = _.defaults(options, defaultOptions);
};

util.inherits(TileLayer, StaticMapLayer);

TileLayer.prototype.__defineGetter__('tileUrl', function() {
  return this.options.tileUrl;
});

TileLayer.prototype.__defineGetter__('tileSize', function() {
  return this.options.tileSize;
});

TileLayer.prototype.compileUrl = function(data) {
  return this.tileUrl.replace('{z}', data.z).replace('{x}', data.x).replace('{y}', data.y);
};

TileLayer.prototype._getTile = function(url){
  var attempts = this.options.attempts || 3;
  return new Promise(function(resolve, reject) {
    fetch(url, attempts, function(err, tile){
      if (err) {
        return reject(err);
      }
      return resolve(tile);
    });
  });
};

//TileLayer.prototype.latLngToPoint = function(latLng) {
//  var map = this.map;
//  var zoom = map.getZoom();
//  var center = map.getCenter();
//  var tileSize = this.tileSize;
//
//  latLng = map.latLng(latLng);
//
//  return {
//    y: Math.floor((this.getHeight() / 2) - tileSize * (center.lat - utils.latToY(latLng.lat, zoom))),
//    x: Math.floor((this.getWidth() / 2) - tileSize * (center.lng - utils.lngToX(latLng.lng, zoom)))
//  };
//};


TileLayer.prototype._drawTile = function(data, point) {
  var img = new Canvas.Image();
  img.src = data;
  var map = this.getMap();

  var x = point.x;
  var y = point.y;

  var extraWidth = x + img.width - map.getWidth();
  var extraHeight = y + img.height - map.getHeight();

  var args = {
    sx: x < 0 ? -x : 0,
    sy: y < 0 ? -y : 0,
    sw: img.width + (x < 0 ? x : 0) - (extraWidth > 0 ? extraWidth : 0),
    sh: img.height + (y < 0 ? y : 0) - (extraHeight > 0 ? extraHeight : 0),
    dx: x < 0 ? 0 : x,
    dy: y < 0 ? 0 : y,
    dw: 256,
    dh: 256
  };

  try {
    map.ctx.drawImage(img,
      args.sx,
      args.sy,
      args.sw,
      args.sh,
      args.dx,
      args.dy,
      args.sw,
      args.sh
    );

  } catch(e) {
    console.log(args);
    throw e;
  }
};


TileLayer.prototype._drawAttribution = function() {
  //var map = this.getMap();
  //var canvas = new Canvas(256, 50);
  //var ctx = canvas.getContext('2d');
  //ctx.font = '20px Arial';
  //ctx.fillStyle ='white';
  //
  //this.getMap().ctx.drawImage(canvas, map.getWidth() - 256, map.getHeight() - 50);
};

TileLayer.prototype.render = function() {
  var map = this.getMap();
  var zoom = map.getZoom();
  var center = map.getCenter();


  var centerPoint = utils.latLngToPoint(center, zoom);


  var cX = centerPoint.x;
  var cY = centerPoint.y;
  var tileSize = this.tileSize;

  var mapWidth = map.getWidth();
  var mapHeight = map.getHeight();

  //image.lonToX = lonToImageX.bind(image, this.tileSize, cX, zoom);
  //image.latToY = latToImageY.bind(image, this.tileSize, cY, zoom);

  var startX = Math.max(0, Math.floor(cX - (mapWidth / tileSize) / 2));
  var startY = Math.max(0, Math.floor(cY - (mapHeight / tileSize) / 2));

  var maxIndex = Math.pow(2, zoom) - 1;
  var endX = Math.min(maxIndex, Math.ceil(cX + (mapWidth / tileSize) / 2));
  var endY = Math.min(maxIndex, Math.ceil(cY + (mapHeight / tileSize) / 2));

  var offsetX = -Math.floor((cX - Math.floor(cX)) * tileSize) +
    Math.floor(mapWidth / 2) + Math.floor(startX - Math.floor(cX)) * tileSize;
  var offsetY = -Math.floor((cY - Math.floor(cY)) * tileSize) +
    Math.floor(mapHeight / 2) + Math.floor(startY - Math.floor(cY)) * tileSize;

  var list = [];

  for (var x = startX; x < endX; x++) {
    for (var y = startY; y < endY; y++) {
      list.push({
        dest: {
          x: (x - startX) * tileSize + offsetX,
          y: (y - startY) * tileSize + offsetY
        },
        url: this.compileUrl({z: zoom, x: x, y: y})
      });
    }
  }

  debug('tiles', list);

  var self = this;


  return Promise.map(list, function(item) {
    return self
      ._getTile(item.url)
      .then(function(tile) {
          self._drawTile(tile, item.dest);
      });
  }).then(function() {
    self._drawAttribution();

    return this;
  });
  //  .catch(function(e) {
  //  console.log('!!!!!!!!', e);
  //});
};


module.exports = TileLayer;