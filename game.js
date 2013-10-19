var invariant = require('./invariant');

var Game = function(num_players) {
  this.age = 1;

  this.players = [];
  for (var i = 0; i < num_players; i++) {
    this.players.push({
      name: 'player'+(i+1),
      money: 3,
      current_hand: [],
      board: [],
    });
  
  }
};

module.exports = Game;
