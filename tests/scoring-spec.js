var Scoring = require('../scoring');
var Player = require('../player');
var Helpers = require('./helpers');

describe('scoring tests', function () {
  var player;
  var left_player;
  var right_player;

  beforeEach(function () {
    player = new Player();
    left_player = new Player();
    right_player = new Player();
    player.left_player = left_player;
    player.right_player = right_player;
  }); 

  it('should give no military tokens for tie', function () {
    expect(Scoring.getMilitaryTokensForPlayerInAge(player, 1)).toEqual([]);

    left_player.board.push(Helpers.militaryCard(1));
    right_player.board.push(Helpers.militaryCard(1));
    player.board.push(Helpers.militaryCard(1));

    expect(Scoring.getMilitaryTokensForPlayerInAge(player, 1)).toEqual([]);
  });

  it('should give correct tokens for wins and losses given age', function () {
    left_player.board.push(Helpers.militaryCard(1));
    player.board.push(Helpers.militaryCard(2));
    right_player.board.push(Helpers.militaryCard(3));

    expect(Scoring.getMilitaryTokensForPlayerInAge(player, 1)).toEqual([1, -1]);
    expect(Scoring.getMilitaryTokensForPlayerInAge(player, 2)).toEqual([3, -1]);
    expect(Scoring.getMilitaryTokensForPlayerInAge(player, 3)).toEqual([5, -1]);
  });
});
