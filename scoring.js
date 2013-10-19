module.exports = {
  getMilitaryTokensForAge: function (player, age) {
    var my_strength = player.getMilitaryStrength();
    var right_strength = player.right_player.getMilitaryStrength(); 
    var left_strength = player.left_player.getMilitaryStrength(); 
    var win_token = age == 1 ? 1 : (age == 2 ? 3 : 5);
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
  }
};
