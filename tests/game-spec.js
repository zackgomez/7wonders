var Actions = require('../actions');
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

  it('should play a card played to the board', function () {
    var game = Game.createWithNRandomSelectionBots(4, function (player) {
      return Actions.play(0);
    });
    game.startAge(1)
    game.playRound();
    var players = game.players;
    _.each(players, function (player) {
      expect(player.board.length).toEqual(1)
    });
  });

  it('should sell a card for the correct amoutn of money', function () {
    var game = Game.createWithNRandomSelectionBots(4, function (player) {
      return Actions.sell(0);
    });
    game.startAge(1)
    var players = game.players;
    _.each(players, function (player) {
      player.money = 0;
    });

    game.playRound();

    _.each(players, function (player) {
      expect(player.money).toEqual(Game.MONEY_FOR_SELL)
    });
  });

  it('should sell a card for the correct amoutn of money', function () {
    var game = Game.createWithNRandomSelectionBots(4, function (player) { });
    game.startAge(1)

    var player = game.players[0];
    game.handleChoice(player, Actions.upgradeWonder(0));

    expect(player.wonder_upgrade_cards.length).toEqual(1);
  });
});
