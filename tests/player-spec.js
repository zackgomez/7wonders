var Player = require('../player');
var Helpers = require('./helpers');

describe('player tests', function () {
  it('should compute military correctly', function() {
    var wonder = {stages: [Helpers.militaryCard(9)], resource: 'W'};
    var p = new Player('name', function () { });
    p.wonder = wonder;
    expect(p.getMilitaryStrength()).toBe(0);

    p.board = [ Helpers.militaryCard(1) ];
    expect(p.getMilitaryStrength()).toBe(1);

    p.board = [ 
      Helpers.militaryCard(2),
      Helpers.victoryCard(),
      Helpers.militaryCard(3),
    ];

    expect(p.getMilitaryStrength()).toBe(5);

    p.board.push(Helpers.wrapWonderStage(p.wonder.stages[0]));
    
    expect(p.getMilitaryStrength()).toBe(14);
  });

  it('should include built military wonders in strength', function () {
    var wonder = {stages: [Helpers.militaryCard(1), Helpers.militaryCard(2)]};
    var player = new Player('name', function () { });
    player.wonder = wonder;

    player.board.push(Helpers.wrapWonderStage(player.wonder.stages[0]));
    player.board.push(Helpers.militaryCard(2));

    expect(player.getMilitaryStrength()).toEqual(3); 
  });
});
