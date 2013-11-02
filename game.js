var _ = require('underscore');
var Actions = require('./actions');
var Cards = require('./cards');
var Deck = require('./deck');
var wonders = require('./wonders');
var invariant = require('./invariant');
var Player = require('./player');
var Scoring = require('./scoring');
var rotate_array = require('./rotate_array');
var invariant_violation = invariant.invariant_violation;

var Game = function (players) {
  var num_players = players.length;
  invariant(num_players >= 3 && num_players <= 7, '3-7 players supported');

  this.players = players;
  this.discards = [];

  // Connect player neighbors
  for (var i = 0; i < num_players; i++) {
    this.players[i].left_player = i == 0 ? 
      this.players[num_players-1] : this.players[i-1];
    this.players[i].right_player = i == num_players - 1 ? 
      this.players[0] : this.players[i+1];
  }

  // initial game state
  this.age = 0;
  this.responseHandler = null;
};

Game.createWithNPlayers = function (num_players) {
  var players = _.times(num_players, function (i) {
    return new Player('player' + (i+1));
  });
  return new Game(players);
};

Game.prototype.isDone = function () {
  return this.age > 3;
};

// Returns an array of requests.  Indexes match those of each player
// passed in
Game.prototype.getRequests = function () {
  // age 0 is about setup, picking your wonder
  if (this.age === 0) {
    this.responseHandler = this.handleWonderResponses.bind(this);
    var selected_wonders = _.sample(wonders.wonders, this.players.length);
    return _.map(selected_wonders, function (wonder) {
      return {
        type: Actions.constants.SELECT_WONDER,
        wonder: wonder,
      };
    });
  } else if (this.age >= 1 && this.age <= 3) {
    this.responseHandler = this.handlePlayResponses.bind(this);
    return _.map(this.players, function (player) {
      return player.getPlayRequest();
    });
  }

  invariant_violation('no requests for age ' + this.age);
};

Game.prototype.handleResponses = function (responses) {
  invariant(
    responses.length === this.players.length,
    'incorrect number of responses'
  );
  invariant(this.responseHandler, 'must have response handler');

  this.responseHandler(responses);

  this.responseHandler = null;
};

Game.prototype.getScores = function () {
  return _.map(this.players, function (players) {
    return Scoring.getEndGameScoreForPlayer(this, players);
  }, this);
};

//
// Private Functions
//

Game.prototype.handleWonderResponses = function (responses) {
  invariant(this.age === 0, 'selecting wonders is for age 0');
  _.each(responses, function (response, i) {
    invariant(
      response.type === Actions.constants.SELECT_WONDER,
      'incorrect response type for wonder selection: ' + response.type
    );
    invariant(response.wonder, 'select wonder response should include wonder');
    var player = this.players[i];
    player.setWonder(response.wonder);
  }, this);

  // Prepare for first age
  this.startAge(1);
};

Game.prototype.handlePlayResponses = function (responses) {
  invariant(this.age >= 1 && this.age <= 3, 'playing cards is for ages 1-3');
  var extra_effects = _.map(responses, function (response, i) {
    return this.handleChoice(this.players[i], response);
  }, this);

  // resolve effects
  _.each(extra_effects, function (effect) {
    effect && effect();
  });

  if (!this.isEndOfAge()) {
    invariant(
      this.age in Game.PASS_DIRECTION_FOR_AGE,
      'no pass direction for age'
    )
    this.passCards(Game.PASS_DIRECTION_FOR_AGE[this.age]);
    return;
  }

  // Advance age
  if (this.age < 3) {
    this.resolveMilitary();
    this.startAge(this.age + 1);
  } else {
    this.age = 4;
  }
};

Game.prototype.handleChoice = function (player, choice) {
  invariant(
    choice.card >= 0 && choice.card < player.current_hand.length,
    'card index '+choice.card+' not found'
  );
  var card = player.current_hand[choice.card];
  // remove card from hand
  player.current_hand.splice(choice.card, 1);

  return this.resolveChoice(player, choice.action, card);
};

Game.prototype.resolveChoice = function (player, action, card) {
  var self = this;
  var extra_effect = null;
  if (action === Actions.constants.PLAY) {
    if (card.effect) {
      extra_effect = function () { return card.effect(self, player); };
    }
    player.board.push(card);
  } else if (action === Actions.constants.SELL) {
    player.money += Game.MONEY_FOR_SELL;
    this.discards.push(card);
  } else if (action === Actions.constants.UPGRADE_WONDER) {
    var wonder_count = player.getCardsOfType('wonder').length;
    invariant(
      wonder_count < player.wonder.stages.length,
      'trying to build wonder after all have been completed'
    );
    player.board.push(
      Cards.wrapWonderStage(player.wonder.stages[wonder_count], card)
    );
  } else if (action === Actions.constants.DISCARD) {
    this.discards.push(card);
  } else {
    invariant_violation('unknown choice action '+action);
  }

  return extra_effect;
};

Game.prototype.passCards = function (direction) {
  invariant(
    direction === Game.PASS_LEFT || direction === Game.PASS_RIGHT,
    'invalid pass direction'
  );

  var cards = _.map(this.players, function (player) {
    var hand = player.current_hand;
    player.current_hand = [];
    return hand;
  });
  cards = rotate_array(cards, direction === Game.PASS_LEFT ? -1 : 1);
  _.each(cards, function (hand, i) {
    this.players[i].current_hand = hand;
  }, this);
};

Game.prototype.startAge = function(age) {
  console.log('Starting age '+age);
  this.age = age;
  var deck = Deck.forAge(this.age, this.players.length);

  _.each(this.players, function(p) {
    p.current_hand = deck.splice(0, Game.HAND_SIZE);
  });
};

Game.prototype.isEndOfAge = function() {
  return this.players[0].current_hand.length == 0;
};

Game.prototype.resolveMilitary = function () {
  _.each(this.players, function (p) {
    p.military_tokens = Scoring.getMilitaryTokensForPlayerInAge(p, this.age);
  }, this);
};


Game.prototype.dumpState = function() {
  console.log("\nCurrent age: "+this.age+"\n");
  console.log("\nPlayers:");
  console.log(this.players);
  console.log("\nDiscard pile: ");
  console.log(this.discards);
}

Game.HAND_SIZE = 7;
Game.MONEY_FOR_SELL = 3;
Game.PASS_LEFT = 'left';
Game.PASS_RIGHT = 'right';
Game.PASS_DIRECTION_FOR_AGE = {
  1: Game.PASS_LEFT,
  2: Game.PASS_RIGHT, 
  3: Game.PASS_LEFT,
};

module.exports = Game;
