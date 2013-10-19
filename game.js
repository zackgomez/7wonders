var _ = require('underscore');
var Cards = require('./cards').cards;
var invariant = require('./invariant');

// Returns a shuffled deck of cards for the given age
var deck_for_age = function(age, num_players) {
  invariant(age >= 1 && age <= 3, 'age must be 1, 2, or 3');

  var deck = _.filter(Cards, function(card) {
    return card.age === age && card.players <= num_players;
  });
  // Special case guilds in the 3rd age
  if (age === 3) {
    var guilds = _.filter(Cards, function(card) {
      return card.age === 'guild';
    });
    deck = deck.concat(guilds);
  }

  invariant(deck.length === 7 * num_players, 'fucked up ' + deck.length);
  return _.shuffle(deck);
}

var Game = function(num_players) {
  this.age = 1;


  this.players = [];
  for (var i = 0; i < num_players; i++) {
    this.players.push({
      name: 'player'+(i+1),
      money: 3,
      cards: [],
    });
  }
};

console.log(deck_for_age(1, 5));
