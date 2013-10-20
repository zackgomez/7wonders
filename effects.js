var _ = require('underscore');
var constants = require('./constants');
var invariant = require('./invariant');

var count_player_card_types = function (player, type) {
  return _.reduce(player.board, function (sum, card) {
    return sum + (card.type === type ? 1 : 0);
  }, 0);
};
var count_card_types = function (player, direction, type) {
  constants.assertDirection(direction);
  var count = 0;
  if (direction & constants.SELF) {
    count += count_player_card_types(player, type);
  }
  if (direction & constants.LEFT) {
    console.log('left');
    count += count_player_card_types(player.left_player, type);
  }
  if (direction & constants.RIGHT) {
    count += count_player_card_types(player.right_player, type);
    console.log('right', count);
  }

  return count;
};

module.exports = {
  make_give_money_effect: function (amount) {
    invariant(amount > 0, 'must give a positive amount of money');
    return function(player) {
      player.money += amount;
    };
  },
  make_money_for_card_type_effect: function (card_type, direction, amount) {
    constants.assertDirection(direction);
    return function (player) {
      player.money += amount * count_card_types(player, direction, card_type);
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
      return amount * count_card_types(player, direction, card_type);
    };
  },
  vps_for_neighbor_military_losses: function (player) {
    return _.reduce([player.left_player, player.right_player], function (s, p) {
      var negative_token_count = _.reduce(p.military_tokens, function (s, token) {
        return s + (token === -1 ? 1 : 0);
      }, 0);
      return s + negative_token_count;
    }, 0);
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
