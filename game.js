var _ = require('underscore');
var Actions = require('./actions');
var Cards = require('./cards');
var Deck = require('./deck');
var wonders = require('./wonders');
var invariant = require('./invariant');
var Player = require('./player');
var Scoring = require('./scoring');
var rotate_array = require('./rotate_array');
var invariant_violation = require('./invariant').invariant_violation;

var Game = function(player_funcs) {
  var num_players = player_funcs.length;
  invariant(num_players >= 3 && num_players <= 7, '3-7 players supported');

  var selected_wonders = _.sample(wonders.wonders, num_players);

  this.discards = [];
  this.players = [];
  this.scores = [];
  for (var i = 0; i < num_players; i++) {
    var player = new Player(
      'player'+(i+1), 
      player_funcs[i]
    );
    player.selectWonder(selected_wonders[i][0], selected_wonders[i][1]);
    this.players.push(player);
    this.scores.push(null);
  }

  for (var i = 0; i < num_players; i++) {
    this.players[i].left_player = i == 0 ? 
      this.players[num_players-1] : this.players[i-1];

    this.players[i].right_player = i == num_players - 1 ? 
      this.players[0] : this.players[i+1];
  }

  // Player who is going to look through the discard and play a card free of
  // cost
  this.discardLooker = null;
};

Game.createWithNIdenticalPlayers = function (num_players, play_func) {
  return new Game(
    _(num_players).times(function () { return play_func; })
  );
};

Game.prototype.run = function () {
  _.each([1,2,3], function (age) {
    this.startAge(age);
    while (!this.isEndOfAge()) {
      this.playRound();
    }

    this.resolveMilitary(age);
  }.bind(this));

  this.scores = _.map(this.players, _.partial(Scoring.getEndGameScoreForPlayer, this));

  return this;
};

Game.prototype.letPlayerLookThroughDiscard = function (player) {
  invariant(
    this.discardLooker === null,
    'can only have one player looking through the discard'
  );
  this.discardLooker = player;
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

Game.prototype.maybePlayDiscardedCards = function () {
  if (!this.discardLooker) return;

  var player = this.discardLooker;
  this.discardLooker = null;

  if (!this.discards.length) return;

  var choice = player.getChoiceFromCards(this.discards);
  invariant(
    choice.card >= 0 && choice.card < this.discards.length,
    'card must be valid'
  );
  var card = this.discards[choice.card];
  this.discards.splice(choice.card, 1);
  var effect = this.resolveChoice(player, choice.action, card);
  effect && effect(this, player);
};

Game.prototype.playRound = function () {
  var extra_effects = _.map(this.players, function (p) {
    var choice = p.getChoiceFromHand();
    return this.handleChoice(p, choice);
  }, this);

  _.each(extra_effects, function (effect) {
    // JS ONE LINER SUCH HOTNESS WOW
    effect && effect();
  });
  this.maybePlayDiscardedCards();

  invariant(
    this.age in Game.PASS_DIRECTION_FOR_AGE,
    'no pass direction for age'
  )
  this.passCards(Game.PASS_DIRECTION_FOR_AGE[this.age]);
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

Game.prototype.startAge = function(age_num) {
  console.log('Starting age '+age_num);
  this.age = age_num;
  var deck = Deck.forAge(this.age, this.players.length);

  _.each(this.players, function(p) {
    p.current_hand = deck.splice(0, Game.HAND_SIZE);
  });
};

Game.prototype.isEndOfAge = function() {
  return this.players[0].current_hand.length == 0;
};

Game.prototype.resolveMilitary = function(age) {
  _.each(this.players, function (p) {
    p.military_tokens = Scoring.getMilitaryTokensForPlayerInAge(p, age);
  });
};


Game.prototype.dumpState = function() {
  console.log("\nCurrent age: "+this.age+"\n");
  console.log("\nPlayers:");
  console.log(this.players);
  console.log("\nScores:");
  console.log(this.scores);
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
