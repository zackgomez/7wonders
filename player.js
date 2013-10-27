var _ = require('underscore');
var Actions = require('./actions');
var Cards = require('./cards');
var invariant = require('./invariant');

var Player = function(name, play_func) {
  this.name = name;
  this.play_func = play_func;
  this.wonder = null;
  this.money = 3;
  this.current_hand = [];
  this.board = [];
  this.military_tokens = [];
  this.left_player = null;
  this.right_player = null;
}

Player.prototype.selectWonder = function (wonder_a, wonder_b) {
  // TODO let player select wonder
  this.wonder = wonder_a;
  // add starting resource 'card' to board
  this.board.push(Cards.wrapWonderResource(this.wonder.resource));
};

Player.prototype.canPlayFinalCard = function () {
  // TODO check if it has a card/wonder upgrade that lets it do this
  return false;
};

Player.prototype.getChoiceFromHand = function () {
  // special case for hand size 1
  if (this.current_hand.length === 1 && !this.canPlayFinalCard()) {
    return Actions.discard(0);
  }
  return this.getChoiceFromCards(this.current_hand);
};

Player.prototype.getChoiceFromCards = function (cards) {
  return this.play_func(this, cards);
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

module.exports = Player;
