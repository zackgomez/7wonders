var effects = require('./effects');
// Only the 'A' sides for now
var wonders = [
  {
    name: 'The Colossus of Rhodes',
    resource: 'O',
    stages: [
      {cost: ['W', 'W'], vps: 3},
      {cost: ['B', 'B', 'B'], military: 2},
      {cost: ['O', 'O', 'O', 'O'], vps: 7}
    ],
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
      {cost: ['B', 'B', 'B'], effect: effects.make_give_money_effect.bind(9)},
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

module.exports = wonders;
