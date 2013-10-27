var Rules = require('../rules');
var Player = require('../player');
var Helpers = require('./helpers');
var Path = Rules.Path;

describe('tests for rules', function () {
  var player;

  beforeEach(function() {
    player = Helpers.basicPlayer();
  }),

  it("should not let you build same card twice", function () {
    player.board.push({ name: 'Baths' });
    expect(Rules.getNullableCostToBuild(player, { name: 'Baths' })).toBeFalsy();
  });

  it("should let you build cards off upgrades even if you don't have enough "+
    "or resources", function () {
    player.board.push({ name: 'Baths', upgrades_to: 'Aqueduct'});
    expect_no_cost(player, { name: 'Aqueduct' });
  });

  it("should allow you to build money cards only if you have enough money", function() {
    player.money = 1;
    var card = { money_cost: 2 };

    var path = Rules.getNullableCostToBuild(player, card);
    expect(path).toEqual(null);

    player.money = 2;
    var path = Rules.getNullableCostToBuild(player, card);
    expect(path).toEqual(new Path().addBankCost(2));
  });

  it("should let you build cards you have enough resources for (simple)", function() {
    player.board.push(Helpers.basicResourceCard(['B']));
    expect_no_cost(player, { resource_cost: ['B'] });
  });

  it("should recognize double resource cards", function() {
    player.board.push(Helpers.basicResourceCard(['B', 'B']));
    player.board.push(Helpers.basicResourceCard(['W']));
    expect_no_cost(player, { resource_cost: ['B', 'B', 'W'] });
  });

  it("should not let you build cards you don't have enough resources for (simple)", function() {
    player.board.push(Helpers.basicResourceCard(['B']));
    var can_build = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['L'] }
    );
    expect(can_build).toEqual(null);
  });

  it("should find builds available through economy cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    expect_no_cost(player, { resource_cost: ['O'] });
  });

  it("should find builds available through slash basic resource cards", function() {
    player.board.push(Helpers.basicResourceCard([['O', 'W']]));
    expect_no_cost(player, { resource_cost: ['O'] });
  });

  it("should not allow double-counting of wild cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    var can_build = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['O', 'W'] }
    );
    expect(can_build).toEqual(null);
  });

  it("should find builds available through multiple wild cards", function() {
    player.board.push(Helpers.economyCard([['O', 'W']]));
    player.board.push(Helpers.economyCard([['O', 'W', 'S', 'B']]));
    player.board.push(Helpers.economyCard([['G', 'P', 'L']]));
    expect_no_cost(player, { resource_cost: ['L', 'S', 'O'] });
  });

  it("should let you borrow a resource from from neighbor", function() {
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O']));
    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'O'] }
    );
    expect(path.leftCost).toEqual(2);
    expect(path.getTotalCost()).toEqual(2);
  });

  it("should let you borrow double resource cards from neighbor", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O', 'W']));
    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'O', 'W'] }
    );
    expect(path.getTotalCost()).toEqual(4);
    expect(path.leftCost).toEqual(4);
  });

  it("should only let you borrow one of slash resource", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard([['O', 'W']]));
    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'O'] }
    );
    expect(path.getTotalCost()).toEqual(2);
    expect(path.leftCost).toEqual(2);

    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'W'] }
    );
    expect(path.getTotalCost()).toEqual(2);
    expect(path.leftCost).toEqual(2);

    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'O', 'W'] }
    );
    expect(path).toBeFalsy();
  });
  
  it("should allow borrowing from two neighbors", function() {
    player.money = 4;
    player.board.push(Helpers.basicResourceCard(['G']));
    player.left_player.board.push(Helpers.basicResourceCard(['O']));
    player.right_player.board.push(Helpers.basicResourceCard(['W']));
    var path = Rules.getNullableCostToBuild(
      player, 
      { resource_cost: ['G', 'O', 'W'] }
    );
    expect(path.getTotalCost()).toEqual(4);
    expect(path.leftCost).toEqual(2);
    expect(path.rightCost).toEqual(2);
  });
});

function expect_no_cost(player, card) {
  var path = Rules.getNullableCostToBuild(player, card);
  expect(path).not.toBeNull();
  expect(path.getTotalCost()).toEqual(0);
}
