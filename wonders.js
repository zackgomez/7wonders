var effects = require('./effects');
/*
// just for reference
var basic = ['W', 'B', 'S', 'O'];
var advanced = ['L', 'G', 'P'];
// tablet, compass, gear
var science = ['T', 'C', 'G'];
*/
// Only the 'A' sides for now
var wonders = [
  {
    name: 'The Colossus of Rhodes',
    resource: 'O',
    stages: [
      {cost: ['W', 'W'], value: 3},
      {cost: ['B', 'B', 'B'], military: 2},
      {cost: ['O', 'O', 'O', 'O'], value: 7}
    ],
  }, {
    name: 'The Lighthouse of Alexandria',
    resource: 'G',
    stages: [
      {cost: ['S', 'S'], value: 3},
      // TODO use 'or' construct for resources
      {cost: ['O', 'O'], resources: [['W', 'B', 'S', 'O']]},
      {cost: ['G', 'G'], value: 7}
    ]
  }, {
    name: 'The Temple of Artemis in Ephesus',
    resource: 'P',
    stages: [
      {cost: ['S', 'S'], value: 3},
      {cost: ['B', 'B', 'B'], effect: effects.make_give_money_effect.bind(9)},
      {cost: ['P', 'P'], value: 7}
    ]
  }, {
    name: 'The Hanging Gardens of Babylon',
    resource: 'B',
    stages: [
      {cost: ['B', 'B'], value: 3},
      // TODO use 'or' construct for science
      {cost: ['W', 'W', 'W'], science: [['T', 'C', 'G']]},
      {cost: ['B', 'B', 'B', 'B'], value: 7}
    ]
  }, {
    name: 'The Statue of Zeus in Olympia',
    resource: 'W',
    stages: [
      {cost: ['W', 'W'], value: 3},
      // TODO special once per age resource that pays for an entire card
      {cost: ['S', 'S'], resources: []},
      {cost: ['O', 'O'], value: 7}
    ]
  }, {
    name: 'The Mausoleum of Halicarnassus',
    resource: 'L',
    stages: [
      {cost: ['B', 'B'], value: 3},
      {cost: ['O', 'O', 'O'], effect: effects.play_discarded_card_effect},
      {cost: ['P', 'P'], value: 7}
    ]
  }, {
    name: 'The Pyramids of Giza',
    resource: 'S',
    stages: [
      {cost: ['S', 'S'], value: 3},
      {cost: ['W', 'W', 'W'], value: 5},
      {cost: ['S', 'S', 'S', 'S'], value: 7}
    ]
  }
];

module.exports = wonders;
