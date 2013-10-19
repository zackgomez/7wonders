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
      money: 3,
      hand: deck.slice(i*7, (i+1)*7),
    });
  }
};

Game.prototype.dumpState = function() {
  console.log(
    this.age,
    this.players
  );
}

module.exports = Game;
