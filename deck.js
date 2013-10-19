var _ = require('underscore');
var invariant = require('./invariant');
var Cards = require('./cards').cards;

module.exports = {
  // Returns a shuffled deck of cards for the given age
  forAge: function (age, num_players) {
    invariant(age >= 1 && age <= 3, 'age must be 1, 2, or 3');

    var deck = _.filter(Cards, function(card) {
      return card.age === age && card.players <= num_players;
    });
    // Special case guilds in the 3rd age
    if (age === 3) {
      var guilds = _.filter(Cards, function(card) {
        return card.age === 'guild';
      });
      var guilds = _.sample(guilds, num_players + 2);
      deck = deck.concat(guilds);
    }

    invariant(deck.length === 7 * num_players, 'fucked up deck');
    return _.shuffle(deck);
  }
};
