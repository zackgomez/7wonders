var _ = require('underscore');

module.exports = {
  // TODO: take into account neighbors
  canPlayerBuildCard: function(player, new_card) {
    var already_built = _.find(player.board, function (card) {
      return card.name == new_card.name;
    });

    if (already_built) return false;

    var can_upgrade = _.find(player.board, function (card) {
      return card.upgrades_to && card.upgrades_to == new_card.name;
    });

    if (can_upgrade) return true;

    if (!new_card.resource_cost) {
      var money_cost = new_card.money_cost || 0;
      return player.money > money_cost;
    }

    var resource_type_to_num_needed = accumulate_resources_by_type(
      new_card.resource_cost
    );

    // We should add neighbor borowwing and have each path have a cost
    var player_resources = [[]];
    _.each(player.board, function(card) {
      if (card.type == 'basic_resource' || card.type == 'advanced_resource') {
        _.each(card.resources, function(resource) {
          player_resources = player_resources || []
          _.each(player_resources, function (current_path) {
            current_path.push(resource);
          });
        });
      } else if (card.type == 'economy') {
        var to_add = [];
        _.each(player_resources, function (current_path) {
          _.each(card.resources[0], function(resource) {
            to_add.push(current_path.concat(resource));
          });
        });
        player_resources = to_add;
      }
    });

    return _.some(player_resources, function (path) {
      return this.resourcesAreSufficient(path, resource_type_to_num_needed);
    }, this);
  },

  resourcesAreSufficient: function(player_resource_list, required_resource_map) {
    var player_resources_by_type = accumulate_resources_by_type(
      player_resource_list
    );

    for (resource_type in required_resource_map) {
      var available_resource = player_resources_by_type[resource_type] || 0;
      var required_resource = required_resource_map[resource_type];
      if (available_resource < required_resource) {
        return false;
      }
    }

    return true;
  }
};

function accumulate_resources_by_type(resources) {
  return _.reduce(
    resources,
    function (accumulator, resource) {
      accumulator[resource] = (accumulator[resource] || 0) + 1;
      return accumulator;
    },
    {}
  );
}
