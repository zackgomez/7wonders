var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');
var _ = require('underscore');

console.log('Welcome to the 7 Wonders command line');

var num_players = 4;

console.log('Starting first age');
Game.createWithNRandomSelectionBots(4).run().dumpState();
