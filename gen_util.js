var Q = require('q');
var invariant = require('./invariant');

module.exports = {
  genv: Q.async(function* (gens) {
    invariant(Array.isArray(gens), 'genv takes an array');
    var results = [];
    for (var i = 0; i < gens.length; i++) {
      results.push(yield gens[i]);
    }
    return results;
  }),
};
