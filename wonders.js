var basic = ['W', 'B', 'S', 'O'];
var advanced = ['L', 'G', 'P'];

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
    stages: []
  }, {
    name: 'The Temple of Artemis in Ephesus',
    resource: 'P',
    stages: []
  }, {
    name: 'The Hanging Gardens of Babylon',
    resource: 'B',
    stages: []
  }, {
    name: 'The Statue of Zeus in Olympia',
    resource: 'W',
    stages: []
  }, {
    name: 'The Mausoleum of Halicarnassus',
    resource: 'L',
    stages: []
  }, {
    name: 'The Pyramids of Giza',
    resource: 'S',
    stages: []
  }
];

module.exports = wonders;
