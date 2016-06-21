'use strict';

function LatLng(lat, lng) {
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
  }
  this.lat = +lat;
  this.lng = +lng;
}

LatLng.prototype = {
  equals: function (obj, maxMargin) {
    if (!obj) { return false; }

    var margin = Math.max(
      Math.abs(this.lat - obj.lat),
      Math.abs(this.lng - obj.lng));

    return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
  },

  clone: function () {
    return new LatLng(this.lat, this.lng);
  }
};

LatLng.create = function(a, b) {
  if (a instanceof LatLng) {
    return a;
  }
  if (Array.isArray(a) && typeof a[0] !== 'object') {
    if (a.length === 3) {
      return new LatLng(a[0], a[1], a[2]);
    }
    if (a.length === 2) {
      return new LatLng(a[0], a[1]);
    }
    return null;
  }
  if (a === undefined || a === null) {
    return a;
  }
  if (typeof a === 'object' && 'lat' in a) {
    return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
  }
  if (b === undefined) {
    return null;
  }
  return new LatLng(a, b);
};

module.exports = LatLng;


