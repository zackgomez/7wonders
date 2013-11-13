var _ = require('underscore');
var Cards = require('./cards');

module.exports = {
  getCanBuild: function(player, new_card) {
    Cards.assertIsCard(new_card);

    var already_built = _.find(player.board, function (card) {
      return card.name == new_card.name;
    });

    if (already_built) return cannot_build(CanBuildResult.ALREADY_BUILT);

    var can_upgrade = _.find(player.board, function (card) {
      return card.upgrades_to && card.upgrades_to == new_card.name;
    });

    if (can_upgrade) return can_build(new Path(), CanBuildResult.UPGRADE);

    if (!new_card.resource_cost) {
      var money_cost = new_card.money_cost || 0;
      if (player.money >= money_cost) {
        return can_build(
          new Path().addBankCost(money_cost),
          CanBuildResult.HAS_ENOUGH_MONEY
        );
      }

      return cannot_build(CanBuildResult.NOT_ENOUGH_MONEY);
    }

    var cost_map = accumulate_resources_by_type(new_card.resource_cost);

    var paths = [ new Path() ];
    _.each(player.board, function(card) {
      if (card.type == 'basic_resource' || 
          card.type == 'advanced_resource' ||
          card.type == 'economy'
         ) {
        var to_add = [];
        var card_resources = card.resources || [];
        if (Array.isArray(card_resources[0])) {
          _.each(paths, function (current_path) {
            _.each(card_resources[0], function(resource) {
              to_add.push(current_path.clone().addResource(resource));
            });
          });
          paths = to_add;
        } else {
          _.each(card_resources, function(resource) {
            _.each(paths, function (current_path) {
              current_path.addResource(resource);
            });
          });
        }
      } 
    });

    var path_with_own_resources = _.find(paths, function(path) {
      return path_is_sufficient(path, cost_map);
    });

    if (path_with_own_resources) {
      return can_build(
        path_with_own_resources, 
        CanBuildResult.OWN_RESOURCES_SUFFICIENT
      );
    }

    paths = this.addNeighborResources(
      paths, 
      player.left_player, 
      Path.prototype.addLeftCost
    );

    paths = this.addNeighborResources(
      paths, 
      player.right_player,
      Path.prototype.addRightCost
    );

    // Find cheapest path
    paths.sort(
      function (p1, p2) { return p1.getTotalCost() - p2.getTotalCost(); }
    );

    var path = _.find(paths, function(path) {
      return path_is_sufficient(path, cost_map);
    });

    if (!path || path.getTotalCost() > player.money) {
      return cannot_build(CanBuildResult.NOT_ENOUGH_RESOURCES_AND_OR_MONEY);
    }

    return can_build(path, CanBuildResult.CAN_BUILD_WITH_BORROWING);
  },

  // TODO: add in trading posts!
  addNeighborResources: function(player_resources, neighbor, add_cost_func) {
    _.each(neighbor.board, function (card) {
      if (card.type == 'basic_resource' || card.type == 'advanced_resource') {
        var card_resources = card.resources || [];
        if (Array.isArray(card_resources[0])) {
          var to_add = [];
          _.each(player_resources, function (current_path) {
            _.each(card_resources[0], function(resource) {
              var new_path = current_path.clone().addResource(resource);
              add_cost_func.call(new_path, 2)
              to_add.push(new_path);
            });
          });
          player_resources = player_resources.concat(to_add);
        } else {
          _.each(card_resources, function(resource) {
            var to_add = [];
            _.each(player_resources, function (current_path) {
              var new_path = current_path.clone().addResource(resource);
              add_cost_func.call(new_path, 2)
              to_add.push(new_path);
            });
            player_resources = player_resources.concat(to_add);
          });
        }
      } 
    });

    return player_resources;
  },

  Path: Path,
  CanBuildResult: CanBuildResult,
};

function can_build(path, reason) {
  return new CanBuildResult(true, path, reason); 
}

function cannot_build(reason) {
  return new CanBuildResult(false, null, reason);
}

function CanBuildResult(true_or_false, path, reason) {
  this.true_or_false = true_or_false;
  this.path = path;
  this.reason = reason;
}

CanBuildResult.prototype.canBuild = function () {
  return this.true_or_false;
};

CanBuildResult.prototype.getReason = function() {
  return this.reason;
};

CanBuildResult.ALREADY_BUILT = 'Already built';
CanBuildResult.NOT_ENOUGH_MONEY = 'Not enough money';
CanBuildResult.NOT_ENOUGH_RESOURCES_AND_OR_MONEY = 'Not enough resources and/or money';
CanBuildResult.UPGRADE = 'Free upgrade';
CanBuildResult.HAS_ENOUGH_MONEY = 'Has enough money';
CanBuildResult.OWN_RESOURCES_SUFFICIENT = 'Can build with own resources';
CanBuildResult.CAN_BUILD_WITH_BORROWING = 'Can build with borrowing from neighbours';

function Path(path, cost) {
  this.path = path || {};
  this.cost = cost || 0;
  this.leftCost = 0;
  this.rightCost = 0;
}

Path.prototype.clone = function() {
  var new_path = new Path();
  new_path.path = _.clone(this.path);
  new_path.cost = this.cost;
  new_path.leftCost = this.leftCost;
  new_path.rightCost = this.rightCost;
  return new_path;
};

Path.prototype.getTotalCost = function() {
  return this.leftCost + this.rightCost + this.cost;
};

Path.prototype.addResource = function(resource) {
  this.path[resource] = (this.path[resource] || 0) + 1;
  return this;
};

Path.prototype.addBankCost = function(cost) {
  this.cost += cost;
  return this;
};

Path.prototype.addLeftCost = function(cost) {
  this.leftCost += cost;
  return this;
};

Path.prototype.addRightCost = function(cost) {
  this.rightCost += cost;
  return this;
};

function path_is_sufficient(path, cost_map) {
  for (resource_type in cost_map) {
    var available_resource = path.path[resource_type] || 0;
    var required_resource = cost_map[resource_type];
    if (available_resource < required_resource) {
      return false;
    }
  }

  return true;
}

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
