var _ = require('underscore');
var Q = require('q');
var genv = require('./gen_util').genv;

var Game = require('./game');
var Player = require('./player');

// player def contains name, play_func
var GameRunner = function (player_defs) {
  this.players = _.map(player_defs, function (def) {
    return new Player(def.name);
  });
  this.game = new Game(this.players);

  this.playFuncs = _.pluck(player_defs, 'play_func');
};

GameRunner.prototype.genRun = Q.async(function* () {
  while (!this.game.isDone()) {
    var requests = this.game.getRequests();

    var gens = _.map(this.players, function (player, i) {
      return this.playFuncs[i](player, requests[i]);
    }, this);

    var responses = yield genv(gens);

    this.game.handleResponses(responses);
  }

  this.game.dumpState();
  console.log('scores', this.game.getScores());
});

module.exports = GameRunner;
