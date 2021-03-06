var LatLng = require('./latlng');

function LatLngBounds(southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
  if (!southWest) { return; }

  var latlngs = northEast ? [southWest, northEast] : southWest;

  for (var i = 0, len = latlngs.length; i < len; i++) {
    this.extend(latlngs[i]);
  }
}

LatLngBounds.prototype = {
  extend: function (obj) {
    var sw = this._southWest,
      ne = this._northEast,
      sw2, ne2;

    if (obj instanceof LatLng) {
      sw2 = obj;
      ne2 = obj;

    } else if (obj instanceof LatLngBounds) {
      sw2 = obj._southWest;
      ne2 = obj._northEast;

      if (!sw2 || !ne2) {
        return this;
      }

    } else {
      return obj ? this.extend(LatLng.create(obj) || LatLngBounds.create(obj)) : this;
    }

    if (!sw && !ne) {
      this._southWest = new LatLng(sw2.lat, sw2.lng);
      this._northEast = new LatLng(ne2.lat, ne2.lng);
    } else {
      sw.lat = Math.min(sw2.lat, sw.lat);
      sw.lng = Math.min(sw2.lng, sw.lng);
      ne.lat = Math.max(ne2.lat, ne.lat);
      ne.lng = Math.max(ne2.lng, ne.lng);
    }

    return this;
  },

  // @method pad(bufferRatio: Number): LatLngBounds
  // Returns bigger bounds created by extending the current bounds by a given percentage in each direction.
  pad: function (bufferRatio) {
    var sw = this._southWest,
      ne = this._northEast,
      heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
      widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

    return new LatLngBounds(
      new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
      new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
  },

  // @method getCenter(): LatLng
  // Returns the center point of the bounds.
  getCenter: function () {
    return new LatLng(
      (this._southWest.lat + this._northEast.lat) / 2,
      (this._southWest.lng + this._northEast.lng) / 2);
  },

  // @method getSouthWest(): LatLng
  // Returns the south-west point of the bounds.
  getSouthWest: function () {
    return this._southWest;
  },

  // @method getNorthEast(): LatLng
  // Returns the north-east point of the bounds.
  getNorthEast: function () {
    return this._northEast;
  },

  // @method getNorthWest(): LatLng
  // Returns the north-west point of the bounds.
  getNorthWest: function () {
    return new LatLng(this.getNorth(), this.getWest());
  },

  // @method getSouthEast(): LatLng
  // Returns the south-east point of the bounds.
  getSouthEast: function () {
    return new LatLng(this.getSouth(), this.getEast());
  },

  // @method getWest(): Number
  // Returns the west longitude of the bounds
  getWest: function () {
    return this._southWest.lng;
  },

  // @method getSouth(): Number
  // Returns the south latitude of the bounds
  getSouth: function () {
    return this._southWest.lat;
  },

  // @method getEast(): Number
  // Returns the east longitude of the bounds
  getEast: function () {
    return this._northEast.lng;
  },

  // @method getNorth(): Number
  // Returns the north latitude of the bounds
  getNorth: function () {
    return this._northEast.lat;
  },

  // @method contains(otherBounds: LatLngBounds): Boolean
  // Returns `true` if the rectangle contains the given one.

  // @alternative
  // @method contains (latlng: LatLng): Boolean
  // Returns `true` if the rectangle contains the given point.
  contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
    if (typeof obj[0] === 'number' || obj instanceof LatLng) {
      obj = LatLng.create(obj);
    } else {
      obj = LatLngBounds.create(obj);
    }

    var sw = this._southWest,
      ne = this._northEast,
      sw2, ne2;

    if (obj instanceof LatLngBounds) {
      sw2 = obj.getSouthWest();
      ne2 = obj.getNorthEast();
    } else {
      sw2 = ne2 = obj;
    }

    return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
      (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
  },

  intersects: function (bounds) {
    bounds = LatLngBounds.create(bounds);

    var sw = this._southWest,
      ne = this._northEast,
      sw2 = bounds.getSouthWest(),
      ne2 = bounds.getNorthEast(),

      latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
      lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

    return latIntersects && lngIntersects;
  },

  toBBoxString: function () {
    return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
  },

  // @method equals(otherBounds: LatLngBounds): Boolean
  // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds.
  equals: function (bounds) {
    if (!bounds) {
      return false;
    }

    bounds = LatLngBounds.create(bounds);

    return this._southWest.equals(bounds.getSouthWest()) &&
      this._northEast.equals(bounds.getNorthEast());
  }
};

LatLngBounds.create = function(a, b) {
  if (a instanceof LatLngBounds) {
    return a;
  }
  return new LatLngBounds(a, b);
};


module.exports = LatLngBounds;