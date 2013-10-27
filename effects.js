var _ = require('underscore');
var constants = require('./constants');
var invariant = require('./invariant');

var count_player_card_types = function (player, type) {
  return player.getCardsOfType(type).length;
};

var iterate_direction = function (player, direction, iterator) {
  constants.assertDirection(direction);
  if (direction & constants.SELF) {
    iterator(player);
  }
  if (direction & constants.LEFT) {
    iterator(player.left_player);
  }
  if (direction & constants.RIGHT) {
    iterator(player.right_player);
  }
};

var count_card_types = function (player, direction, type) {
  var count = 0;
  iterate_direction(player, direction, function (p) {
    count += count_player_card_types(p, type);
  });
  return count;
};

var count_completed_wonder_stages = function (player, direction) {
  return count_card_types(player, direction, 'wonder');
};

module.exports = {
  make_give_money_effect: function (amount) {
    invariant(amount > 0, 'must give a positive amount of money');
    return function (game, player) {
      player.money += amount;
    };
  },
  make_money_for_card_type_effect: function (card_type, direction, amount) {
    constants.assertDirection(direction);
    return function (game, player) {
      player.money += amount * count_card_types(player, direction, card_type);
    };
  },
  play_discarded_card_effect: function (game, player) {
    game.letPlayerLookThroughDiscard(player);
  },
  make_trading_resource: function (direction, tradable_resources) {
    constants.assertDirection(direction);
    return function (game, player) {
      // TODO return available resources/cost
      return [];
    };
  },
  make_vps_for_card_type_effect: function (card_type, direction, amount) {
    constants.assertDirection(direction);
    return function (game, player) {
      return amount * count_card_types(player, direction, card_type);
    };
  },
  vps_for_neighbor_military_losses: function (game, player) {
    return _.reduce([player.left_player, player.right_player], function (s, p) {
      var negative_token_count = _.reduce(p.military_tokens, function (s, token) {
        return s + (token === -1 ? 1 : 0);
      }, 0);
      return s + negative_token_count;
    }, 0);
  },
  make_sum_vps_effect: function (items) {
    return function (game, player) {
      return _.reduce(items, function (total, item) {
          return total + item(game, player);
        }, 0);
    };
  },
  make_money_for_wonder_stages_effect: function (direction, amount) {
    constants.assertDirection(direction);
    return function (game, player) {
      player.money += amount * count_completed_wonder_stages(player, direction);
    };
  },
  make_vps_for_wonder_stages_effect: function (direction, amount) {
    constants.assertDirection(direction);
    return function (game, player) {
      return amount * count_completed_wonder_stages(player, direction);
    };
  },
  play_final_card_effect: function (game, player) {
    // TODO
  },
};
