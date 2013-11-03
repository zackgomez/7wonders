var Actions = require('../actions');
var Effects = require('../effects');
var Game = require('../game');
var Helpers = require('./helpers');
var _ = require('underscore');

describe('game tests', function() {
  it('should give players links to neighbors', function() {
    var players = Helpers.newGame(4).players;
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
    var game = Helpers.newGame(4);
    game.startAge(1);
    var players = game.players;
    _.each(players, function (player) {
      expect(player.current_hand.length).toBe(Game.HAND_SIZE);
    });
  });

  it('should play a card played to the board', function () {
    var game = Helpers.newGame(4);
    game.startAge(1)
    var players = game.players;
    var hand_len = _.map(players, function (player) {
      return player.board.length;
    });

    Helpers.playRound(game, Actions.play(0));

    _.each(players, function (player, i) {
      expect(player.board.length).toEqual(hand_len[i] + 1)
    });
  });

  it('should sell a card for the correct amount of money', function () {
    var game = Helpers.newGame(4);
    game.startAge(1)
    var players = game.players;
    _.each(players, function (player) {
      player.money = 0;
    });

    Helpers.playRound(game, Actions.sell(0));

    _.each(players, function (player) {
      expect(player.money).toEqual(Game.MONEY_FOR_SELL)
    });
  });

  it('should get money from playing a money effect card', function () {
    var game = Helpers.newGame(4);
    game.startAge(1)
    var player = game.players[0];
    player.name = _.uniqueId('name');
    player.money = 0;
    var effect_hit = false;
    player.current_hand[0] = {effect: function () { effect_hit = true; }};

    Helpers.playRound(game, Actions.play(0));
    expect(effect_hit).toBe(true);
  });

  it('should play upgrade wonder properly', function () {
    var game = Helpers.newGameWithWonders(4);
    var player = game.players[0];
    game.startAge(1)

    Helpers.playRound(game, Actions.upgradeWonder(0));

    expect(player.board.length).toEqual(2);
    expect(player.board[1].type).toEqual('wonder');
    expect(player.board[1].vps).toEqual(3);
  });
});
