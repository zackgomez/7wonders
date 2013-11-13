var _ = require('underscore');
var Actions = require('./actions');
var Cards = require('./cards');
var invariant = require('./invariant');

var last_player_id = 100;
var new_player_id = function () {
  return last_player_id++;
};

var Player = function (name) {
  this.id = new_player_id();
  this.name = name;
  this.wonder = null;
  this.money = 3;
  this.current_hand = [];
  this.board = [];
  this.military_tokens = [];
  this.left_player = null;
  this.right_player = null;
}

Player.prototype.setWonder = function (wonder) {
  invariant(this.wonder === null, 'wonder already set');
  this.wonder = wonder;
  // add starting resource 'card' to board
  this.board.push(Cards.wrapWonderResource(this.wonder.resource));
};

Player.prototype.canPlayFinalCard = function () {
  // TODO check if it has a card/wonder upgrade that lets it do this
  return false;
};

Player.prototype.getPlayRequest = function () {
  var type = this.current_hand.length === 1 && !this.canPlayFinalCard() ?
    Actions.constants.DISCARD_FINAL_CARD :
    Actions.constants.SELECT_CARD;
  return {
    type: type,
    cards: this.current_hand,
  };
};

Player.prototype.getMilitaryStrength = function () {
  return _.reduce(this.board, function (accumulator, card) {
    return accumulator + (card.military ? card.military : 0);
  }, 0);
};

Player.prototype.getCardsOfType = function (type) {
  return _.filter(this.board, function (card) {
    return card.type === type;
  });
};

Player.prototype.getResources = function () {
  return _.filter(
    _.pluck(this.board, 'resources'),
    _.identity
  );
};

module.exports = Player;
