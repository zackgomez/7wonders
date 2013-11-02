var actions = {
  PLAY: 'play',
  SELL: 'sell',
  UPGRADE_WONDER: 'upgrade',
  DISCARD: 'discard',

  SELECT_CARD: 'select_card',
  SELECT_WONDER: 'select_wonder',
  DISCARD_FINAL_CARD: 'dfc',
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

  discard: function (card_index) {
    return make_action(actions.DISCARD, card_index);
  },

  selectWonder: function (wonder) {
    return {
      type: actions.SELECT_WONDER,
      wonder: wonder,
    };
  },
};
