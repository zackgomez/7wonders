module.exports = {
  militaryCard: function(strength) {
    return { type: 'military', military: strength };
  },

  guildCardWithVPs: function(points) {
    return { type: 'guild', vps: points };
  },

  victoryCard: function(points) {
    return { type: 'victory', vps: points };
  },

  victoryCardWithFunc: function(func) {
    return { type: 'victory', vps: func };
  },
};
