var _ = require('underscore');
var Deck = require('./deck');
var wonders = require('./wonders');
var invariant = require('./invariant');

var Game = function(player_funcs) {
  var num_players = player_funcs.length;
  invariant(num_players >= 3 && num_players <= 7, '3-7 players supported');

  var selected_wonders = _.sample(wonders, num_players);

  this.discards = [];
  this.players = [];
  for (var i = 0; i < num_players; i++) {
    this.players.push({
      name: 'player'+(i+1),
      wonder: selected_wonders[i],
      money: 3,
      current_hand: [],
      board: [],
      military_score: 0,
      play_func: player_funcs[i],
    });
  }

  this.startAge(1);
};

Game.createWithNRandomSelectionBots = function(num_bots) {
  return new Game(
    _(num_bots).times(function () { return random_selection; })
  );
};

Game.prototype.run = function() {
  while (!this.isEndOfAge()) {
    var passed_cards = _.map(this.players, function(p) {
      var choice = p.play_func(p);
      p.board.push(p.current_hand[choice]);
      p.current_hand.splice(choice, 1);
      var to_pass = p.current_hand;
      p.current_hand = [];
      return to_pass;
    });

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
  }

  return this;
};

var random_selection = function(player) {
  return 0; // just pick first card
};

Game.prototype.startAge = function(age_num) {
  this.age = age_num;
  var deck = Deck.forAge(this.age, this.players.length);

  _.each(this.players, function(p) {
    p.current_hand = deck.splice(0, Game.HAND_SIZE);
  });

  _.each(this.players, function (player) {
    invariant(
      player.current_hand.length == Game.HAND_SIZE, 
      'Each player should have seven cards. '+player.name+' has '+
      player.current_hand.length + ' cards'
    );
  });
};

Game.prototype.isEndOfAge = function() {
  return this.players[0].current_hand.length == 0;
};

Game.prototype.resolveChoices = function (choices) {
  invariant(
    Array.isArray(choices) && choices.length === this.players.length,
    'choices should be an array with entry for each player'
  );

  for (var i = 0; i < choices.length; i++) {
    // TODO handle choice
    // choice is a card to play out of the handle and as well as a way to
    // pay the resource cost
  }

  // TODO rotate cards/move age/end game
}

Game.prototype.dumpState = function() {
  console.log("\nCurrent age: "+this.age+"\n");
  console.log("\nPlayers:");
  console.log(this.players);
  console.log("\nDiscard pile: ");
  console.log(this.discards);
}

Game.HAND_SIZE = 7;

module.exports = Game;
