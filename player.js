var _ = require('underscore');

var Player = function(name, selected_wonder, play_func) {
  this.name = name;
  this.play_func = play_func;
  this.wonder = selected_wonder;
  this.money = 3;
  this.current_hand = [];
  this.board = [];
  this.military_score = 0;
  this.left_player = null;
  this.right_player = null;
}

Player.prototype.getMilitaryStrength = function () {
  return _.reduce(this.board, function (accumulator, card) {
    return accumulator + (card.type == 'military' ? card.military : 0); 
  }, 0);
};

module.exports = Player;
