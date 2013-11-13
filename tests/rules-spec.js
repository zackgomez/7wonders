var Rules = require('../rules');
var Player = require('../player');
var Helpers = require('./helpers');
var Path = Rules.Path;
var CanBuildResult = Rules.CanBuildResult;

describe('tests for rules', function () {
  var player;

  beforeEach(function() {
    player = Helpers.basicPlayer();
  }),

  it("should not let you build same card twice", function () {
    player.board.push({ name: 'Baths' });
    expect_cannot_build_for_reason(
      CanBuildResult.ALREADY_BUILT, 
      player, 
      { name: 'Baths' }
    );
  });

  it("should let you build cards off upgrades even if you don't have enough "+
    "or resources", function () {
    player.board.push({ name: 'Baths', upgrades_to: 'Aqueduct'});
    expect_free_build(CanBuildResult.UPGRADE, player, { name: 'Aqueduct' });
  });

  it("should allow you to build money cards only if you have enough money", function() {
    player.money = 1;
    var card = { money_cost: 2 };

    expect_cannot_build_for_reason(
      CanBuildResult.NOT_ENOUGH_MONEY, 
      player,
      card
    );

    player.money = 2;
    var path = Rules.getCanBuild(player, card);
    var can_build = expect_can_build_for_reason(
      CanBuildResult.HAS_ENOUGH_MONEY, 
      player,
      card
    );
    expect(can_build.path).toEqual(new Path(card).addBankCost(2));
  });

  it("should let you build cards you have enough resources for (simple)", function() {
    player.board.push(Helpers.basicResourceCard(['B']));
    expect_can_build_with_own_resources(player, { resource_cost: ['B'] });
  });

  it("should recognize double resource cards", function() {
    player.board.push(Helpers.basicResourceCard(['B', 'B']));
    player.board.push(Helpers.basicResourceCard(['W']));
    expect_can_build_with_own_resources(player, { resource_cost: ['B', 'B', 'W'] });
  });

  it("should not let you build cards you don't have enough resources for (simple)", function() {
    player.board.push(Helpers.basicResourceCard(['B']));
    expect_cannot_build_for_reason(
      CanBuildResult.NOT_ENOUGH_RESOURCES_AND_OR_MONEY,
      player, 
      { resource_cost: ['L'] }
    );
  });

  it("should find builds available through economy cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    expect_can_build_with_own_resources(player, { resource_cost: ['O'] });
  });

  it("should find builds available through slash basic resource cards", function() {
    player.board.push(Helpers.basicResourceCard([['O', 'W']]));
    expect_can_build_with_own_resources(player, { resource_cost: ['O'] });
  });

  it("should not allow double-counting of wild cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    expect_cannot_build_for_reason(
      CanBuildResult.NOT_ENOUGH_RESOURCES_AND_OR_MONEY, 
      player, 
      { resource_cost: ['O', 'W'] }
    );
  });

  it("should find builds available through multiple wild cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    player.board.push(Helpers.economyCard([['O', 'W', 'S', 'B']]));
    player.board.push(Helpers.economyCard([['G', 'P', 'L']]));
    expect_can_build_with_own_resources(player, { resource_cost: ['L', 'S', 'O'] });
  });

  it("should let you borrow a resource from from neighbor", function() {
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O']));
    var can_build = expect_can_build_for_reason(
      CanBuildResult.CAN_BUILD_WITH_BORROWING, 
      player,
      { resource_cost: ['G', 'O'] }
    );
    expect(can_build.path.leftCost).toEqual(2);
    expect(can_build.path.getTotalCost()).toEqual(2);
  });

  it("should let you borrow double resource cards from neighbor", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O', 'W']));
    var can_build = expect_can_build_for_reason(
      CanBuildResult.CAN_BUILD_WITH_BORROWING, 
      player,
      { resource_cost: ['G', 'O', 'W'] }
    );
    expect(can_build.path.getTotalCost()).toEqual(4);
    expect(can_build.path.leftCost).toEqual(4);
  });

  it("should only let you borrow one of slash resource", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard([['O', 'W']]));
    var can_build = expect_can_build_for_reason(
      CanBuildResult.CAN_BUILD_WITH_BORROWING, 
      player,
      { resource_cost: ['G', 'O'] }
    );
    expect(can_build.path.getTotalCost()).toEqual(2);
    expect(can_build.path.leftCost).toEqual(2);

    var can_build = expect_can_build_for_reason(
      CanBuildResult.CAN_BUILD_WITH_BORROWING, 
      player,
      { resource_cost: ['G', 'W'] }
    );
    expect(can_build.path.getTotalCost()).toEqual(2);
    expect(can_build.path.leftCost).toEqual(2);

    expect_cannot_build_for_reason(
      CanBuildResult.NOT_ENOUGH_RESOURCES_AND_OR_MONEY, 
      player,
      { resource_cost: ['G', 'O', 'W'] }
    );
  });
  
  it("should allow borrowing from two neighbors", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O']));
    player.right_player.board.push(Helpers.basicResourceCard(['W']));
    var can_build = expect_can_build_for_reason(
      CanBuildResult.CAN_BUILD_WITH_BORROWING, 
      player,
      { resource_cost: ['G', 'O', 'W'] }
    );
    expect(can_build.path.getTotalCost()).toEqual(4);
    expect(can_build.path.leftCost).toEqual(2);
    expect(can_build.path.rightCost).toEqual(2);
  });
});

function expect_cannot_build_for_reason(reason, player, card) {
  var can_build = Rules.getCanBuild(player, card);
  expect(can_build.canBuild()).toBeFalsy();
  expect(can_build.path).toBeFalsy();
  expect(can_build.getReason()).toEqual(reason);
  return can_build;
}

function expect_can_build_for_reason(reason, player, card) {
  var can_build = Rules.getCanBuild(player, card);
  expect(can_build.canBuild()).toBeTruthy();
  expect(can_build.path).toBeTruthy();
  expect(can_build.getReason()).toEqual(reason);
  return can_build;
}

function expect_free_build(reason, player, card) {
  var can_build = expect_can_build_for_reason(reason, player, card);
  expect(can_build.path.getTotalCost()).toEqual(0);
  return can_build;
}

function expect_can_build_with_own_resources(player, card) {
  return expect_free_build(CanBuildResult.OWN_RESOURCES_SUFFICIENT, player, card);
}
