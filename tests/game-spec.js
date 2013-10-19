var Game = require('../game');
var _ = require('underscore');

describe('game tests', function() {
  it('should give players links to neighbors', function() {
    var players = Game.createWithNRandomSelectionBots(4).players;
    expect(players[0].left_player.name).toBe(players[3].name);
    expect(players[0].right_player.name).toBe(players[1].name);

    expect(players[1].left_player.name).toBe(players[0].name);
    expect(players[1].right_player.name).toBe(players[2].name);

    expect(players[2].left_player.name).toBe(players[1].name);
    expect(players[2].right_player.name).toBe(players[3].name);

    expect(players[3].left_player.name).toBe(players[2].name);
    expect(players[3].right_player.name).toBe(players[0].name);
  });

  it('should give each player seven cards to start age', function() {
    var game = Game.createWithNRandomSelectionBots(4);
    game.startAge(1);
    var players = game.players;
    _.each(players, function (player) {
      expect(player.current_hand.length).toBe(Game.HAND_SIZE);
    });
  });
});
