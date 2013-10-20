var _ = require('underscore');
var invariant = require('./invariant');

var Player = function(name, selected_wonder, play_func) {
  this.name = name;
  this.play_func = play_func;
  this.wonder = selected_wonder;
  this.money = 3;
  this.current_hand = [];
  this.board = [];
  // cards played facedown as wonder upgrades
  this.wonder_upgrade_cards = [];
  this.military_tokens = [];
  this.left_player = null;
  this.right_player = null;
}

Player.prototype.getMilitaryStrength = function () {
  var wonder_military = _.reduce(
    this.getCompletedWonderStages(),
    function (accumulator, stage) {
      return accumulator + (stage.military ? stage.military : 0);
    },
    0
  );
  return _.reduce(this.board, function (accumulator, card) {
    return accumulator + (card.type == 'military' ? card.military : 0);
  }, wonder_military);
};

Player.prototype.getCompletedWonderStages = function () {
  invariant(
    this.wonder_upgrade_cards.length <= this.wonder.stages.length,
    'too many wonder upgrades'
  );
  return this.wonder.stages.slice(0, this.wonder_upgrade_cards.length);
};

module.exports = Player;
