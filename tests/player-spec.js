var Player = require('../player');
var Helpers = require('./helpers');

describe('player tests', function () {
  it('should compute military correctly', function() {
    var p = new Player();
    expect(p.getMilitaryStrength()).toBe(0);

    p.board = [ { type: 'military', military : 1 } ];
    expect(p.getMilitaryStrength()).toBe(1);

    p.board = [ 
      Helpers.militaryCard(2),
      Helpers.victoryCard(),
      Helpers.militaryCard(3),
    ];

    expect(p.getMilitaryStrength()).toBe(5);
  })
});
