var _ = require('underscore');
var Actions = require('./actions');
var Deck = require('./deck');
var wonders = require('./wonders');
var invariant = require('./invariant');
var Player = require('./player');
var Scoring = require('./scoring');
var invariant_violation = require('./invariant').invariant_violation;

var Game = function(player_funcs) {
  var num_players = player_funcs.length;
  invariant(num_players >= 3 && num_players <= 7, '3-7 players supported');

  var selected_wonders = _.sample(wonders, num_players);

  this.discards = [];
  this.players = [];
  this.scores = [];
  for (var i = 0; i < num_players; i++) {
    this.players.push(
      new Player(
        'player'+(i+1), 
        selected_wonders[i],
        player_funcs[i]
      )
    );
    this.scores.push(null);
  }

  for (var i = 0; i < num_players; i++) {
    this.players[i].left_player = i == 0 ? 
      this.players[num_players-1] : this.players[i-1];

    this.players[i].right_player = i == num_players - 1 ? 
      this.players[0] : this.players[i+1];
  }
};

Game.createWithNRandomSelectionBots = function(num_bots, bot_func) {
  return new Game(
    _(num_bots).times(function () { return bot_func; })
  );
};

Game.prototype.run = function() {
  _.each([1,2,3], function(age) {
    this.startAge(age);
    while (!this.isEndOfAge()) {
      this.playRound();
    }

    this.resolveMilitary(age);
  }.bind(this));

  this.scores = _.map(this.players, Scoring.getEndGameScoreForPlayer);

  return this;
};

Game.prototype.handleChoice = function (player, choice) {
  invariant(
    choice.card >= 0 && choice.card < player.current_hand.length,
    'card index '+choice.card+' not found'
  );
  var card = player.current_hand[choice.card];
  // remove card from hand
  player.current_hand.splice(choice, 1);

  if (choice.action === Actions.constants.PLAY) {
    player.board.push(card);
  } else if (choice.action === Actions.constants.SELL) {
    player.money += Game.MONEY_FOR_SELL;
  } else if (choice.action === Actions.constants.UPGRADE_WONDER) {
    player.wonder_upgrade_cards.push(card);
  } else {
    invariant_violation('unknown choice action '+choice.action);
  }
};

Game.prototype.playRound = function () {
  var passed_cards = _.map(this.players, function(p) {
    var choice = p.play_func(p);

    this.handleChoice(p, choice);

    var to_pass = p.current_hand;
    p.current_hand = [];
    return to_pass;
  }.bind(this));

  if (passed_cards[0].length == 1) {
    _.each(passed_cards, function (cards) {
      this.discards.push(cards[0]);
    }.bind(this));
  } else {
    console.log('Players picking card, passing '+passed_cards[0].length);
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].current_hand = passed_cards[i];
    }
  }
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

module.exports = Game;
