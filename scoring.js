var _ = require('underscore');
var invariant = require('./invariant');
var tokens_by_age = [1, 3, 5];

var optimize_science = function (sciences) {
  // TODO optimize science score given array of sciences
  // only difficult part is that some sciences might be an array of choices
  return 0;
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
    
    // TODO sum from wonder stages here
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
        invariant_violation('card vp property should be undefined, a function or a number');
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
