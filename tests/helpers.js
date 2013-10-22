var invariant = require('../invariant');

var name_counter = 0;
module.exports = {
  basicWonder: function() {
    return {stages: [{vps: 3}, {vps: 5}]};
  },

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

  basicResourceCard: function(resources) {
    return { 
      type: 'basic_resource', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  },

  advancedResourceCard: function(resources) {
    return { 
      type: 'advanced_resource', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  },

  economyCard: function(resources) {
    invariant(
      resources instanceof Array, 
      "Economy card should have array of possible resources"
    );

    return { 
      type: 'economy', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  }
};
