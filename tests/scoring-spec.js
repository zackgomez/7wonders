var Scoring = require('../scoring');
var Player = require('../player');
var Helpers = require('./helpers');

describe('scoring tests', function () {
  var wonder;
  var player;
  var left_player;
  var right_player;

  beforeEach(function () {
    player = new Player('p', Helpers.basicWonder());
    left_player = new Player('lp', Helpers.basicWonder());
    right_player = new Player('rp', Helpers.basicWonder());
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

  it('should correctly calculate and round money score', function () {
    player.money = 0;
    expect(Scoring.getEndGameScoreForPlayer(player).money).toEqual(0);

    player.money = 5;
    expect(Scoring.getEndGameScoreForPlayer(player).money).toEqual(1);

    player.money = 6;
    expect(Scoring.getEndGameScoreForPlayer(player).money).toEqual(2);
  });

  it('should correctly sum military score', function () {
    player.military_tokens = [-1, 3, 5];
    expect(Scoring.getEndGameScoreForPlayer(player).military).toEqual(7);

    player.military_tokens = [];
    expect(Scoring.getEndGameScoreForPlayer(player).military).toEqual(0);

    player.military_tokens = [-1, -1, -1, 3, -1];
    expect(Scoring.getEndGameScoreForPlayer(player).military).toEqual(-1);
  });

  it('should correctly calculate victory point functions', function () {
    player.board.push(Helpers.victoryCardWithFunc(function () { return 5; }));
    player.board.push(Helpers.victoryCard(3));
    expect(Scoring.getEndGameScoreForPlayer(player).victory).toEqual(8);
  });

  it('should correctly split victory and guild points', function () {
    player.money = 0;
    player.board.push(Helpers.victoryCardWithFunc(function () { return 5; }));
    player.board.push(Helpers.victoryCard(3));
    player.board.push(Helpers.guildCardWithVPs(15));

    var score = Scoring.getEndGameScoreForPlayer(player);
    expect(score.victory).toEqual(8);
    expect(score.guild).toEqual(15);
    expect(score.total).toEqual(23);
  });

  it('should count completed wonder points', function () {
    var wonder = {stages: [{vps: 3}, {vps: 5}]};
    player.wonder = wonder;

    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));

    var score = Scoring.getEndGameScoreForPlayer(player);
    expect(score.wonder).toEqual(3);

    player.wonder_upgrade_cards.push(Helpers.victoryCard(0));
    var score = Scoring.getEndGameScoreForPlayer(player);
    expect(score.wonder).toEqual(8);
  });
});
