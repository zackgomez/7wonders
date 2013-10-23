var effects = require('../effects');
var Player = require('../player');
var Helpers = require('./helpers');
var constants = require('../constants');

describe('effects tests', function () {
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

  it('should give money when executing a give money effect', function () {
    var effect = effects.make_give_money_effect(5);

    player.money = 0;
    effect(player);
    expect(player.money).toEqual(5);
  });

  it('should calculate neighbor military loss points correct', function () {
    left_player.military_tokens = [-1, 3, 5];
    right_player.military_tokens = [-1, -1, -1];

    expect(effects.vps_for_neighbor_military_losses(player)).toEqual(4);
  });

  it('should properly calculate neighbor card points', function () {
    left_player.board.push(victoryCard(0));
    left_player.board.push(victoryCard(0));

    right_player.board.push(victoryCard(0));
    right_player.board.push(victoryCard(0));
    right_player.board.push(victoryCard(0));
    right_player.board.push(guildCardWithVPs(0));

    player.board.push(victoryCard(0));
    player.board.push(guildCardWithVPs(0));

    expect(
      effects.make_vps_for_card_type_effect('victory', constants.SELF, 1)(player)
    ).toEqual(1);
    expect(
      effects.make_vps_for_card_type_effect('victory', constants.LEFT, 1)(player)
    ).toEqual(2);
    expect(
      effects.make_vps_for_card_type_effect('victory', constants.RIGHT, 1)(player)
    ).toEqual(3);
    expect(
      effects.make_vps_for_card_type_effect('victory', constants.NEIGHBORS, 1)(player)
    ).toEqual(5);
    expect(
      effects.make_vps_for_card_type_effect('victory', constants.ALL, 1)(player)
    ).toEqual(6);
  });

  it('should give vps for completed wonder points', function () {
    player.board.push(Helpers.wrapWonderStage(player.wonder.stages[0]));
    left_player.board.push(Helpers.wrapWonderStage(player.wonder.stages[0]));
    left_player.board.push(Helpers.wrapWonderStage(player.wonder.stages[1]));

    expect(
      effects.make_vps_for_wonder_stages_effect(constants.SELF, 1)(player)
    ).toEqual(1);
    expect(
      effects.make_vps_for_wonder_stages_effect(constants.LEFT, 1)(player)
    ).toEqual(2);
    expect(
      effects.make_vps_for_wonder_stages_effect(constants.RIGHT, 1)(player)
    ).toEqual(0);
    expect(
      effects.make_vps_for_wonder_stages_effect(constants.NEIGHBORS, 1)(player)
    ).toEqual(2);
    expect(
      effects.make_vps_for_wonder_stages_effect(constants.ALL, 1)(player)
    ).toEqual(3);
    expect(
      effects.make_vps_for_wonder_stages_effect(constants.ALL, 3)(player)
    ).toEqual(9);
  });

  it('should give money for completed wonder points', function () {
    player.board.push(Helpers.wrapWonderStage(player.wonder.stages[0]));
    left_player.board.push(Helpers.wrapWonderStage(player.wonder.stages[0]));
    left_player.board.push(Helpers.wrapWonderStage(player.wonder.stages[1]));

    player.money = 0;
    effects.make_money_for_wonder_stages_effect(constants.SELF, 1)(player);
    expect(player.money).toEqual(1);
  });
});
