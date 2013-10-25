var Actions = require('./actions');
var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');
var _ = require('underscore');

console.log('Welcome to the 7 Wonders command line');

var num_players = 4;

var bot_play_func = function (player) {
  return Actions.play(0);
};

console.log('Starting first age');
Game.createWithNIdenticalPlayers(4, bot_play_func).run().dumpState();
