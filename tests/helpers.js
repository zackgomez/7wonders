var _ = require('underscore');
var invariant = require('../invariant');
var Actions = require('../actions');
var Cards = require('../cards');
var Game = require('../game');
var Player = require('../player');

var name_counter = 0;

module.exports = {
  basicWonder: function() {
    return {stages: [{vps: 3}, {vps: 5}], resource: 'W'};
  },

  militaryCard: function(strength) {
    return { type: 'military', military: strength };
  },

  guildCardWithVPs: function(points) {
    return { type: 'guild', vps: points };
  },

  victoryCard: function(points) {
    return { type: 'victory', vps: points };
  },

  victoryCardWithFunc: function(func) {
    return { type: 'victory', vps: func };
  },

  wonderCardWithEffect: function (effect) {
    return { type: 'wonder', effect: effect };
  },

  basicResourceCard: function(resources) {
    return { 
      type: 'basic_resource', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  },

  advancedResourceCard: function(resources) {
    return { 
      type: 'advanced_resource', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  },

  economyCard: function(resources) {
    invariant(
      resources instanceof Array, 
      "Economy card should have array of possible resources"
    );

    return { 
      type: 'economy', 
      resources: resources, 
      name: 'card'+name_counter++
    };
  },
  
  scienceCard: function(sciences) {
    return {
      type: 'science',
      science: sciences,
      name: 'card'+name_counter++
    };
  },

  wrapWonderStage: function(stage) {
    return Cards.wrapWonderStage(stage, victoryCard(0));
  },

  basicPlayer: function () {
    var player = new Player('basic_player', function () { });
    player.wonder = this.basicWonder();
    player.left_player = new Player();
    player.right_player = new Player();
    return player;
  },

  newGame: function (nplayers) {
    nplayers = nplayers || 4;
    return Game.createWithNPlayers(nplayers);
  },

  newGameWithWonders: function (nplayers) {
    var game = this.newGame(nplayers);
    var requests = game.getRequests();
    game.handleResponses(_.map(requests, function (request) {
      return Actions.selectWonder(request.wonder[0]);
    }));
    return game;
  },

  playRound: function (game, action) {
    var requests = game.getRequests();
    game.handleResponses(_.map(requests, function () {
      return action;
    }));
    return game;
  },
};
