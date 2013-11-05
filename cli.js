var _ = require('underscore');
var fs = require('fs');
var readline = require('readline');
var Q = require('q');

var Actions = require('./actions');
var Game = require('./game');
var Deck = require('./deck');
var invariant = require('./invariant');
var invariant_violation = invariant.invariant_violation;
var genv = require('./gen_util.js').genv;

var bot_play_func = Q.async(function* (player, request) {
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
});

var prompt_user = Q.async(function* (prompt) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return yield Q.nfcall(function (cb) {
    rl.question(prompt, function (input) {
      rl.close();
      cb(null, input);
    });
  });
});

var parse_input = function (cards, input) {
  input = input.split(' ');
  if (input.length != 2) {
    throw new Error('Input must be an action and a card');
  }
  var action = input[0], card = parseInt(input[1]);
  if ((card != 0 && !card) || card < 0 || card >= cards.length) {
    throw new Error('Invalid card selected');
  }

  switch(action) {
  case 'p':
  case 'play':
    return Actions.play(card);
  case 's':
  case 'sell':
    return Actions.sell(card);
  case 'inpsect':
    console.log('assuming inpsect is the British spelling of inspect');
  case 'i':
  case 'inspect':
    print_card_details(cards[card]);
  throw new Error('');
  case 'wonedr':
    console.log('assuming wonedr is the British spelling of wonder');
  case 'w':
  case 'wonder':
    return Actions.upgradeWonder(card);
  default:
    throw new Error('Invalid action. You can [p]lay, [s]ell, [w]onder, or [i]nspect your cards');
  }
};

var player_prompt = function (player, cards) {
  str = '\n' + player.name + ' current card choice:\n';
  _.each(cards, function(card, index) {
    str += '\t' + card.name;
    _(20-card.name.length).times(
      function() {
      str += ' ';
    }
    );
    str +=' [' + index + ']' + '\n';
  });
  console.log(str);
};

var select_card = Q.async(function *(player, cards) {
  invariant(cards.length > 0, 'must have some cards to pick from!');
  // try until we get a valid action
  while (true) {
    try { 
      player_prompt(player, cards);
      var input = yield prompt_user(
        'Which card would you like to [p]lay/[s]ell/[w]onder/[i]nspect? '
      );
      var action = parse_input(cards, input);
      return action;
    } catch (e) {
      console.log(e);
    }
  }
});

//TODO(igillis) pretty printer class for other fields/wonder/etc with validation
var pretty_print_type = function(type) {
  switch(type) {
    case 'advanced_resource':
      return 'Advanced Resource';
    case 'basic_resource':
      return 'Basic Resource';
    case 'guild':
      return 'Guild';
    case 'military':
      return 'Military';
    case 'economy':
      return 'Economy';
    case 'science':
      return 'Science';
    case 'victory':
      return 'Victory';
    default:
      return 'Undefined type!';
  }
};

//TODO(igillis) handle functions gracefully (pretty printer)
var print_card_details = function(card) {
  console.log(' ' + card.name);
  console.log('  Type: ' + pretty_print_type(card.type));

  var cost_str = '  Cost: ';
  if (card.resource_cost) cost_str += card.resource_cost + ' ';
  if (card.money_cost) cost_str += card.money_cost + ' coins ';
  console.log(cost_str);

  if (Array.isArray(card.resources)) console.log('  Resources: ' + card.resources);
  if (typeof card.vps == 'number') console.log('  Victory points: ' + card.vps);
  if (typeof card.military == 'number') console.log('  Military: ' + card.military);
  if (card.science) console.log('  Science: ' + card.science);
  if (card.upgrades_from) console.log('  Upgrades from: ' + card.upgrades_from);
  //TODO(zacharyg) upgrades_to?
  //TODO(elynde) finish resource trading post type cards 
  //TODO(igillis) handle money effects
};

var user_play_func = Q.async(function* (player, request) {
  if (request.type === Actions.constants.SELECT_WONDER) {
    return Actions.selectWonder(request.wonder[0]);
  } else if (request.type === Actions.constants.SELECT_CARD) {
    return yield select_card(player, request.cards);
  } else if (request.type === Actions.constants.DISCARD_FINAL_CARD) {
    invariant(
      request.cards.length === 1,
      'should only have 1 card when discarding final card'
    );
    return Actions.discard(0);
  } else {
    invariant_violation('unknown request type \'' + request.type + '\'');
  }
});

// Main function
Q.spawn(function* () {
  console.log('Welcome to the 7 Wonders command line');

  var nplayers = 4;
  var game = Game.createWithNPlayers(nplayers);
  var players = game.players;
  while (!game.isDone()) {
    var requests = game.getRequests();

    var gens = _.map(players, function (player, i) {
      if (i == 0) return user_play_func(player, requests[i]);
      return bot_play_func(player, requests[i]);
    });

    var responses = yield genv(gens);

    game.handleResponses(responses);
  }

  game.dumpState();
  console.log('scores', game.getScores());
});
