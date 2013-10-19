var constants = require('./constants');
var invariant = require('./invariant');

module.exports = {
  make_give_money_effect: function (amount) {
    invariant(amount > 0, 'must give a positive amount of money');
    return function(game, owning_player) {
      game.getPlayer(owning_player).money += amount;
    };
  },
  make_money_for_card_type_effect: function (card_type, direction, amount) {
    return function (game, owning_player) {
      // TODO fill amount based on game, card_type, owning_player and direction
      var total = 0;
      game.getPlayer(owning_player).money += total;
    };
  },
  play_discarded_card_effect: function (game, owning_player) {
    // TODO
  },
  make_trading_resource: function (dir, tradable_resources) {
    invariant(
      dir === constants.LEFT ||
      dir === constants.RIGHT ||
      dir === constants.NEIGHBORS,
      'direction must be left, right or both'
    );
    return function(game_state, owning_player) {
      // TODO return available resources/cost
      return [];
    };
  }
};
