var Player = require('../player');
var Helpers = require('./helpers');

describe('player tests', function () {
  it('should compute military correctly', function() {
    var p = new Player();
    p.wonder = {stages: [{military: 9}]};
    expect(p.getMilitaryStrength()).toBe(0);

    p.board = [ { type: 'military', military : 1 } ];
    expect(p.getMilitaryStrength()).toBe(1);

    p.board = [ 
      Helpers.militaryCard(2),
      Helpers.victoryCard(),
      Helpers.militaryCard(3),
    ];

    expect(p.getMilitaryStrength()).toBe(5);

    p.wonder_upgrade_cards.push(Helpers.victoryCard());
    
    expect(p.getMilitaryStrength()).toBe(14);
  })

  it('should return completed wonder stages', function () {
    var player = new Player();
    player.wonder = {stages: [{vps: 3}, {vps: 5}]};
    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));

    expect(player.getCompletedWonderStages()).toEqual([{vps: 3}]);

    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));
    expect(player.getCompletedWonderStages()).toEqual([{vps: 3}, {vps: 5}]);
  });
});
