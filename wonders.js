var _ = require('underscore');
var invariant = require('./invariant');
var effects = require('./effects');

var wonders_a = [
  {
    name: 'The Colossus of Rhodes',
    resource: 'O',
    stages: [
      {cost: ['W', 'W'], vps: 3},
      {cost: ['B', 'B', 'B'], military: 2},
      {cost: ['O', 'O', 'O', 'O'], vps: 7}
    ]
  }, {
    name: 'The Lighthouse of Alexandria',
    resource: 'G',
    stages: [
      {cost: ['S', 'S'], vps: 3},
      {cost: ['O', 'O'], resources: [['W', 'B', 'S', 'O']]},
      {cost: ['G', 'G'], vps: 7}
    ]
  }, {
    name: 'The Temple of Artemis in Ephesus',
    resource: 'P',
    stages: [
      {cost: ['S', 'S'], vps: 3},
      {cost: ['B', 'B', 'B'], effect: effects.make_give_money_effect(9)},
      {cost: ['P', 'P'], vps: 7}
    ]
  }, {
    name: 'The Hanging Gardens of Babylon',
    resource: 'B',
    stages: [
      {cost: ['B', 'B'], vps: 3},
      {cost: ['W', 'W', 'W'], science: ['T', 'C', 'G']},
      {cost: ['B', 'B', 'B', 'B'], vps: 7}
    ]
  }, {
    name: 'The Statue of Zeus in Olympia',
    resource: 'W',
    stages: [
      {cost: ['W', 'W'], vps: 3},
      // TODO special once per age resource that pays for an entire card
      {cost: ['S', 'S'], resources: []},
      {cost: ['O', 'O'], vps: 7}
    ]
  }, {
    name: 'The Mausoleum of Halicarnassus',
    resource: 'L',
    stages: [
      {cost: ['B', 'B'], vps: 3},
      {cost: ['O', 'O', 'O'], effect: effects.play_discarded_card_effect},
      {cost: ['P', 'P'], vps: 7}
    ]
  }, {
    name: 'The Pyramids of Giza',
    resource: 'S',
    stages: [
      {cost: ['S', 'S'], vps: 3},
      {cost: ['W', 'W', 'W'], vps: 5},
      {cost: ['S', 'S', 'S', 'S'], vps: 7}
    ]
  }
];

var wonders_b = [
  {
    name: 'The Colossus of Rhodes',
    resource: 'O',
    stages: [
      {cost: ['B', 'B', 'B'], vps: 3, military: 1, effect: effects.make_give_money_effect(3)},
      {cost: ['O', 'O', 'O', 'O'], vps: 4, military: 2, effect: effects.make_give_money_effect(4)}
    ]
  }, {
    name: 'The Lighthouse of Alexandria',
    resource: 'G',
    stages: [
      {cost: ['B', 'B'], resources: [['W', 'S', 'O', 'B']]},
      {cost: ['W', 'W'], resources: [['G', 'L', 'P']]},
      {cost: ['S', 'S', 'S'], vps: 7}
    ]
  }, {
    name: 'The Temple of Artemis in Ephesus',
    resource: 'P',
    stages: [
      {cost: ['S', 'S'], vps: 2, effect: effects.make_give_money_effect(4)},
      {cost: ['W', 'W'], vps: 3, effect: effects.make_give_money_effect(4)},
      {cost: ['P', 'L', 'G'], vps: 5, effect: effects.make_give_money_effect(4)}
    ]
  }, {
    name: 'The Hanging Gardens of Babylon',
    resource: 'B',
    stages: [
      {cost: ['L', 'B'], vps: 3},
      {cost: ['G', 'W', 'W'], effect: effects.play_final_card_effect},
      {cost: ['B', 'B', 'B', 'P'], science: ['T', 'C', 'G']}
    ]
  }, {
    name: 'The Statue of Zeus in Olympia',
    resource: 'W',
    stages: [
      // TODO add bidirection basic resource trading effect
      {cost: ['W', 'W']},
      {cost: ['S', 'S'], vps: 5},
      {cost: ['O', 'O', 'L'], vps: effects.copy_guild_vp_effect}
    ]
  }, {
    name: 'The Mausoleum of Halicarnassus',
    resource: 'L',
    stages: [
      {cost: ['O', 'O'], vps: 2, effect: effects.play_discarded_card_effect},
      {cost: ['B', 'B', 'B'], vps: 1, effect: effects.play_discarded_card_effect},
      {cost: ['P', 'G', 'L'], effect: effects.play_discarded_card_effect}
    ]
  }, {
    name: 'The Pyramids of Giza',
    resource: 'S',
    stages: [
      {cost: ['W', 'W'], vps: 3},
      {cost: ['S', 'S', 'S'], vps: 5},
      {cost: ['B', 'B', 'B'], vps: 5},
      {cost: ['S', 'S', 'S', 'S', 'P'], vps: 7}
    ]
  }
];

module.exports = {
  A: wonders_a,
  B: wonders_b,
};
