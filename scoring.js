var _ = require('underscore');
var invariant = require('./invariant');
var constants = require('./constants');
var tokens_by_age = [1, 3, 5];

var optimize_science = function (sciences, path) {
  // This is a DFS. The science is sliced so do whatever you want with it
  // but path doesn't get cloned, so make sure to push/pop correctly.
  // That kinda sucks but #yolo.
  
  path = path || [];
  // Base case - calculate value of path
  if (!sciences.length) {
    var scienceTypeCount = {};
    _.each(path, function(type) {
      scienceTypeCount[type] = (scienceTypeCount[type] || 0) + 1;
    });

    var total = 0;
    var minCount;
    _.each(constants.SCIENCE, function(type) {
      var count = scienceTypeCount[type] || 0;
      minCount = minCount ? Math.min(minCount, count) : count;
      total += Math.pow(count, 2);
    });
    return total + (minCount || 0) * 7;
  }
  
  var scienceOption = sciences[0];
  var nextSciences = sciences.slice(1, sciences.length);
  if (typeof scienceOption === 'object') {
    var max = 0;
    _.each(scienceOption, function(science) {
      path.push(science);
      max = Math.max(max, optimize_science(nextSciences, path));
      path.pop();
    });
    return max;
  } else if (typeof scienceOption === 'string') {
    path.push(scienceOption);
    var val = optimize_science(nextSciences, path);
    path.pop();
    return val;
  }
  invariant.invariant_violation('Sciences must be an array or string.');
}

module.exports = {
  getMilitaryTokensForPlayerInAge: function (player, age) {
    var my_strength = player.getMilitaryStrength();
    var right_strength = player.right_player.getMilitaryStrength(); 
    var left_strength = player.left_player.getMilitaryStrength(); 
    invariant(age - 1 >= 0 && age - 1 < tokens_by_age.length, 'no win token for age '+age);
    var win_token = tokens_by_age[age - 1];
    var tokens = [];

    if (my_strength > left_strength) {
      tokens.push(win_token);
    } else if (my_strength < left_strength) {
      tokens.push(-1);
    }

    if (my_strength > right_strength) {
      tokens.push(win_token);
    } else if (my_strength < right_strength) {
      tokens.push(-1);
    }

    return tokens;
  },

  getEndGameScoreForPlayer: function (player) {
    var score = {};
    // 1pt for each 3 coins
    score.money = Math.floor(player.money / 3);

    // military score is sum of military tokens
    score.military = _.reduce(player.military_tokens, function (total, t) {
      return total + t;
    }, 0);
    
    score.wonder = 0;
    score.victory = 0;
    score.economy = 0;
    score.guild = 0;
    // sum card points from 'vps' field
    // covers victory, economy and guild cards
    _.each(player.board, function (card) {
      if (!card.vps) {
        return;
      }
      if (typeof card.vps === 'function') {
        score[card.type] += card.vps(player);
      } else if (typeof card.vps === 'number') {
        score[card.type] += card.vps;
      } else {
        invariant.invariant_violation('card vp property should be undefined, a function or a number');
      }
    });
    // accumulate sciences
    var sciences = _.filter(
      _.map(player.board, function (card) { return card.science; }),
      function (science) { return !!science; }
    );
    score.science = optimize_science(sciences);

    score.total = _.reduce(score, function (s, i) { return s + i; }, 0);

    return score;
  },
};
