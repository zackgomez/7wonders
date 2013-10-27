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

var bot_play_func = function (player, cards) {
  invariant(cards.length > 0, 'must have some cards to pick from!');
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

var user_play_func = function (player, cards) {
  invariant(cards.length > 0, 'must have some cards to pick from!');
  var card = prompt_user(get_player_prompt(player), function(card) {
    return card;
  });
  return Actions.play(parseInt(card.slice(0,1)));
};

console.log('Starting first age');
var nplayers = 4;
var play_funcs = [user_play_func]
while (play_funcs.length < nplayers) {
  play_funcs.push(bot_play_func);
}

var game = new Game(play_funcs);
game.run().dumpState();
