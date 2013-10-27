var Rules = require('../rules');
var Player = require('../player');
var Helpers = require('./helpers');

describe('tests for rules', function () {
  it("should not let you build same card twice", function () {
    var player = Helpers.basicPlayer();
    player.board.push({ name: 'Baths' });
    expect(Rules.canPlayerBuildCard(player, { name: 'Baths' })).toBeFalsy();
  });

  it("should let you build cards off upgrades even if you don't have enough "+
    "or resources", function () {
    var player = Helpers.basicPlayer();
    player.board.push({ name: 'Baths', upgrades_to: 'Aqueduct'});
    expect(Rules.canPlayerBuildCard(player, { name: 'Aqueduct' })).toBeTruthy();
  });

  it("should let you build cards you have enough resources for (simple)", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.basicResourceCard(['B']));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['B'] }
    );
    expect(can_build).toBeTruthy();
  });

  it("should recognize double resource cards", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.basicResourceCard(['B', 'B']));
    player.board.push(Helpers.basicResourceCard(['W']));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['B', 'B', 'W'] }
    );
    expect(can_build).toBeTruthy();
  });

  it("should not let you build cards you don't have enough resources for (simple)", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.basicResourceCard(['B']));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['L'] }
    );
    expect(can_build).toBeFalsy();
  });

  it("should find builds available through wild cards", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.economyCard([['O', 'W']]));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['O'] }
    );
    expect(can_build).toBeTruthy();
  });

  it("should not allow double-counting of wild cards", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.economyCard([['O', 'W']]));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['O', 'W'] }
    );
    expect(can_build).toBeFalsy();
  });

  it("should find builds available through multiple wild cards", function() {
    var player = Helpers.basicPlayer();
    player.board.push(Helpers.economyCard([['O', 'W']]));
    player.board.push(Helpers.economyCard([['O', 'W', 'S', 'B']]));
    player.board.push(Helpers.economyCard([['G', 'P', 'L']]));
    var can_build = Rules.canPlayerBuildCard(
      player, 
      { resource_cost: ['L', 'S', 'O'] }
    );
    expect(can_build).toBeTruthy();
  });
});
