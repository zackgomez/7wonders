var Player = require('../player');
var Helpers = require('./helpers');

describe('player tests', function () {
  it('should compute military correctly', function() {
    var p = new Player();
    p.wonder = {stages: [Helpers.militaryCard(9)]};
    expect(p.getMilitaryStrength()).toBe(0);

    p.board = [ Helpers.militaryCard(1) ];
    expect(p.getMilitaryStrength()).toBe(1);

    p.board = [ 
      Helpers.militaryCard(2),
      Helpers.victoryCard(),
      Helpers.militaryCard(3),
    ];

    expect(p.getMilitaryStrength()).toBe(5);

    p.wonder_upgrade_cards.push(Helpers.victoryCard());
    
    expect(p.getMilitaryStrength()).toBe(14);
  });

  it('should include built military wonders in strength', function () {
    var player = new Player();

    player.wonder = {stages: [Helpers.militaryCard(1), Helpers.militaryCard(2)]};
    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));
    player.board.push(Helpers.militaryCard(2));

    expect(player.getMilitaryStrength()).toEqual(3); 
  });

  it('should return completed wonder stages', function () {
    var player = new Player();
    player.wonder = {stages: [Helpers.victoryCard(3), Helpers.victoryCard(5)]};
    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));

    expect(player.getCompletedWonderStages()).toEqual([Helpers.victoryCard(3)]);

    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));
    expect(player.getCompletedWonderStages()).toEqual(
      [Helpers.victoryCard(3), Helpers.victoryCard(5)]
    );
  });
});
