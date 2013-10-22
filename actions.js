var actions = {
  PLAY: 'play',
  SELL: 'sell',
  UPGRADE_WONDER: 'upgrade',
};

var make_action = function (action, card) {
    return {
      action: action,
      card: card,
    };
}

module.exports = {
  constants: actions,

  play: function (card_index) {
    return make_action(actions.PLAY, card_index);
  },

  sell: function (card_index) {
    return make_action(actions.SELL, card_index);
  },

  upgradeWonder: function (card_index) {
    return make_action(actions.UPGRADE_WONDER, card_index);
  },
};
