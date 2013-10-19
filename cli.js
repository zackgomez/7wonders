var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');

console.log('Welcome to the 7 Wonders command line');

var num_players = 4;

var game = new Game(num_players);

var deck = Deck.forAge(1, num_players);

console.log('Dealing out cards for first age');

for (var i = 0; i < game.players.length; i++) {
  game.players[i].current_hand = deck.splice(0, 7);
}

invariant(deck.length == 0, 'All cards should be dealt');
for (var i = 0; i < game.players.length; i++) {
  var player = game.players[i];
  invariant(
    player.current_hand.length == 7, 
    'Each player should have seven cards. '+player.name+' has '+
    player.current_hand.length + ' cards'
  );
}

console.log('Cards dealt, this is as far as we are for now');
