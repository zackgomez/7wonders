var invariant = require('./invariant');

module.exports = {
  // Wood, Brick, Stone, Ore
  BASIC_RESOURCES: ['W', 'B', 'S', 'O'],
  // Loom, Glass, Press
  ADVANCED_RESOURCES: ['L', 'G', 'P'],
  // Tablet, Compass, Gear
  SCIENCE: ['T', 'C', 'G'],

  // Directions
  SELF: 'SELF',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  NEIGHBORS: 'NEIGHBORS',
  ALL: 'ALL',

  assertDirection: function(dir) {
    // TODO(zack): uhhh clean this 'module.exports' business up
    invariant(
      dir === module.exports.SELF ||
      dir === module.exports.LEFT ||
      dir === module.exports.RIGHT ||
      dir === module.exports.NEIGHBORS ||
      dir === module.exports.ALL,
      'direction must be self, left, right or neighbors or all.  got: '+dir
    );
    return dir;
  },
};
