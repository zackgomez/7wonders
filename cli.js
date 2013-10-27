var Actions = require('./actions');
var fs = require('fs');
var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');
var _ = require('underscore');

console.log('Welcome to the 7 Wonders command line');

var num_players = 4;

var prompt_user = function(prompt, callback) {
  console.log(prompt);
  var input = fs.readFileSync('/dev/stdin', 'utf-8').toString();
  return callback(input);
};

var bot_play_func = function (player) {
  return Actions.play(0);
};

var get_player_prompt = function (player) {
  str = '\n' + player.name + ' current hand:\n';
  _.each(player.current_hand, function(card, index) {
    num_spaces = 20 - card.name.length;
    str += '\t' + card.name;
    _(num_spaces).times(
      function() {
        str += ' ';
      }
    );
    str +=' [' + index + ']' + '\n';
  });
  str += 'Which card would you like to play?\n';
  return str;
};

var user_play_func = function (player) {
  var card = prompt_user(get_player_prompt(player), function(card) {
    return card;
  });
  return Actions.play(parseInt(card.slice(0,1)));
};

var get_play_func = function() {
  //return bot_play_func;
  return user_play_func;
};

console.log('Starting first age');
Game.createWithNIdenticalPlayers(4, get_play_mode()).run().dumpState();
