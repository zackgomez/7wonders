var _ = require('underscore');
var constants = require('./constants');
var invariant = require('./invariant');

module.exports = {
  make_give_money_effect: function (amount) {
    invariant(amount > 0, 'must give a positive amount of money');
    return function(player) {
      game.getPlayer(player).money += amount;
    };
  },
  make_money_for_card_type_effect: function (card_type, direction, amount) {
    constants.assertDirection(direction);
    return function (player) {
      // TODO fill amount based on card_type, player and direction
      var total = 0;
      game.getPlayer(player).money += total;
    };
  },
  play_discarded_card_effect: function (player) {
    // TODO
  },
  make_trading_resource: function (direction, tradable_resources) {
    constants.assertDirection(direction);
    return function(player) {
      // TODO return available resources/cost
      return [];
    };
  },
  make_vps_for_card_type_effect: function (card_type, direction, amount) {
    constants.assertDirection(direction);
    return function(player) {
      // TODO
      return 0;
    };
  },
  vps_for_neighbor_military_losses: function (player) {
    // TODO
    return 0;
  },
  make_sum_vps_effect: function (items) {
    return function(player) {
      return _.reduce(items, function (total, item) {
          return total + item(player);
        }, 0);
    };
  },
  make_money_for_wonder_stages_effect: function (direction, amount) {
    constants.assertDirection(direction);
    return function (player) {
      // TODO
      return 0;
    };
  },
  make_vps_for_wonder_stages_effect: function (direction, amount) {
    constants.assertDirection(direction);
    return function (player) {
      // TODO
      return 0;
    };
  },
};
