var Cards = require('../cards');
var Scoring = require('../scoring');
var Player = require('../player');
var Helpers = require('./helpers');

describe('scoring tests', function () {
  var wonder;
  var player;
  var left_player;
  var right_player;

  beforeEach(function () {
    player = new Player('p');
    player.wonder = Helpers.basicWonder();
    left_player = new Player('lp');
    left_player.wonder = Helpers.basicWonder();
    right_player = new Player('rp');
    right_player.wonder = Helpers.basicWonder();
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
    expect(Scoring.getEndGameScoreForPlayer(null, player).money).toEqual(0);

    player.money = 5;
    expect(Scoring.getEndGameScoreForPlayer(null, player).money).toEqual(1);

    player.money = 6;
    expect(Scoring.getEndGameScoreForPlayer(null, player).money).toEqual(2);
  });

  it('should correctly sum military score', function () {
    player.military_tokens = [-1, 3, 5];
    expect(Scoring.getEndGameScoreForPlayer(null, player).military).toEqual(7);

    player.military_tokens = [];
    expect(Scoring.getEndGameScoreForPlayer(null, player).military).toEqual(0);

    player.military_tokens = [-1, -1, -1, 3, -1];
    expect(Scoring.getEndGameScoreForPlayer(null, player).military).toEqual(-1);
  });

  it('should correctly calculate victory point functions', function () {
    player.board.push(Helpers.victoryCardWithFunc(function () { return 5; }));
    player.board.push(Helpers.victoryCard(3));
    expect(Scoring.getEndGameScoreForPlayer(null, player).victory).toEqual(8);
  });

  it('should correctly split victory and guild points', function () {
    player.money = 0;
    player.board.push(Helpers.victoryCardWithFunc(function () { return 5; }));
    player.board.push(Helpers.victoryCard(3));
    player.board.push(Helpers.guildCardWithVPs(15));

    var score = Scoring.getEndGameScoreForPlayer(null, player);
    expect(score.victory).toEqual(8);
    expect(score.guild).toEqual(15);
    expect(score.total).toEqual(23);
  });

  it('should count completed wonder points', function () {
    var wonder = {stages: [{vps: 3}, {vps: 5}]};
    player.wonder = wonder;

    player.board.push(Cards.wrapWonderStage(player.wonder.stages[0]));

    var score = Scoring.getEndGameScoreForPlayer(null, player);
    expect(score.wonder).toEqual(3);

    player.board.push(Cards.wrapWonderStage(player.wonder.stages[1]));
    var score = Scoring.getEndGameScoreForPlayer(null, player);
    expect(score.wonder).toEqual(8);
  });
  
  it('should correctly optimize science points', function () {
    player.board.push(Helpers.scienceCard('T'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(1);
    
    player.board.push(Helpers.scienceCard('C'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(2);

    player.board.push(Helpers.scienceCard('T'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(5);

    player.board.push(Helpers.scienceCard('G'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(13);

    player.board.push(Helpers.scienceCard('T'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(18);

    player.board.push(Helpers.scienceCard('C'))
    player.board.push(Helpers.scienceCard(['T', 'C', 'G']));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(31);
    
    player.board.push(Helpers.scienceCard(['T', 'C', 'G']));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(38);
  });
  
  it('should correctly optimize wonder science points', function () {
    player.wonder = {stages: [{science: ['T', 'C', 'G']}]};
    player.board.push(Cards.wrapWonderStage(player.wonder.stages[0]));
    player.board.push(Helpers.scienceCard('T'));
    player.board.push(Helpers.scienceCard('C'));
    expect(Scoring.getEndGameScoreForPlayer(null, player).science).toEqual(10);
  });
});
