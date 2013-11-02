var _ = require('underscore');
var Actions = require('./actions');
var fs = require('fs');
var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');
var invariant_violation = invariant.invariant_violation;

var bot_play_func = function (player, request) {
  if (request.type === Actions.constants.SELECT_WONDER) {
    return Actions.selectWonder(request.wonder[0]);
  } else if (request.type === Actions.constants.SELECT_CARD) {
    return Actions.play(0);
  } else if (request.type === Actions.constants.DISCARD_FINAL_CARD) {
    invariant(
      request.cards.length === 1,
      'should only have 1 card when discarding final card'
    );
    return Actions.discard(0);
  } else {
    invariant_violation('unknown request type \'' + request.type + '\'');
  }
};

/*
var prompt_user = function(prompt, callback) {
  console.log(prompt);
  var input = fs.readFileSync('/dev/stdin', 'utf-8').toString();
  return callback(input);
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
*/

var nplayers = 4;
var game = Game.createWithNPlayers(nplayers);
var players = game.players;

while (!game.isDone()) {
  var requests = game.getRequests();

  var responses = _.map(players, function (player, i) {
    var request = requests[i];
    return bot_play_func(player, request);
  });

  game.handleResponses(responses);
}

game.dumpState();
console.log('scores', game.getScores());
