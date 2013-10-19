module.exports = {
  militaryCard: function(strength) {
    return { type: 'military', military: strength };
  },

  victoryCard: function(points) {
    return { type: 'victory', vps: points };
  }
};
