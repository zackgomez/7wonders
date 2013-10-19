var constants = require('./constants');
var invariant = require('./invariant');

module.exports = {
  make_give_money_effect: function (amount) {
    invariant(amount > 0, 'must give a positive amount of money');
    return function(game, owning_player) {
      game.getPlayer(owning_player).money += amount;
    };
  },
  play_discarded_card_effect: function (game, owning_player) {
    // TODO
  },
  make_trading_resource: function (dir, tradable_resources) {
    invariant(
      dir === constants.LEFT ||
      dir === constants.RIGHT ||
      dir === constants.BOTH,
      'direction must be left, right or both'
    );
    return function(game_state, owning_player) {
      // TODO return available resources/cost
      return [];
    };
  }
};
