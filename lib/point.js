'use strict';


function Point(x, y, round) {
  this.x = (round ? Math.round(x) : x);
  this.y = (round ? Math.round(y) : y);
}

Point.create = function(x, y, round) {
  if (x instanceof Point) {
    return x;
  }
  if (Array.isArray(x)) {
    return new Point(x[0], x[1]);
  }
  if (x === undefined || x === null) {
    return x;
  }
  if (typeof x === 'object' && 'x' in x && 'y' in x) {
    return new Point(x.x, x.y);
  }
  return new Point(x, y, round);
};

Point.prototype = {
  clone: function () {
    return new Point(this.x, this.y);
  }
};

module.exports = Point;