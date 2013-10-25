var _ = require('underscore');
var invariant = require('./invariant');

var array_rotate = function (arr, amount) {
  invariant(Array.isArray(arr), 'must have array');
  invariant(amount === Math.floor(amount), 'must be int');

  var rotated = [];
  rotated.length = arr.length;

  _.each(arr, function (val, i) {
    var rotated_ind = i + amount;
    while (rotated_ind < 0) {
      rotated_ind += arr.length;
    }
    rotated_ind %= arr.length;
    rotated[rotated_ind] = val;
  });

  return rotated;
};

module.exports = array_rotate;
