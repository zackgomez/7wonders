var _ = require('underscore');
var cards = require('./cards');
var wonders = require('./wonders');
var invariant = require('./invariant');

var Game = function(num_players) {
  invariant(num_players >= 3 && num_players <= 7, '3-7 players supported');

  this.age = 1;

  var deck = cards.deck_for_age(1, num_players);
  var selected_wonders = _.sample(wonders, num_players);

  this.players = [];
  for (var i = 0; i < num_players; i++) {
    this.players.push({
      name: 'player'+(i+1),
      wonder: selected_wonders[i],
      hand: deck.slice(i*7, (i+1)*7),
      money: 3,
      military_score: 0
    });
  }
};

Game.prototype.resolveChoices = function (choices) {
  invariant(
    Array.isArray(choices) && choices.length === this.players.length,
    'choices should be an array with entry for each player'
  );

  for (var i = 0; i < choices.length; i++) {
    // TODO handle choice
    // choice is a card to play out of the handle and as well as a way to
    // pay the resource cost
  }

  // TODO rotate cards/move age/end game
}

Game.prototype.dumpState = function() {
  console.log(
    this.age,
    this.players
  );
}

module.exports = Game;
