var _ = require('underscore');
var constants = require('./constants');
var effects = require('./effects');

var cards = [
  {age: 1, type: 'victory', name: 'Baths', players: 3, resource_cost: ['S'], vps: 3},
  {age: 1, type: 'victory', name: 'Altar', players: 3, vps: 2},
  {age: 1, type: 'victory', name: 'Theater', players: 3, vps: 2},
  {age: 1, type: 'economy', name: 'East Trading Post', players: 3, resources: effects.make_trading_resource(constants.LEFT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'West Trading Post', players: 3, resources: effects.make_trading_resource(constants.RIGHT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'Marketplace', players: 3, resources: effects.make_trading_resource(constants.NEIGHBORS, constants.ADVANCED_RESOURCES)},
  {age: 1, type: 'military', name: 'Stockade', players: 3, resource_cost: ['W'], military: 1},
  {age: 1, type: 'military', name: 'Barracks', players: 3, resource_cost: ['O'], military: 1},
  {age: 1, type: 'military', name: 'Guard Tower', players: 3, resource_cost: ['B'], military: 1},
  {age: 1, type: 'science', name: 'Apothecary', players: 3, resource_cost: ['L'], science: 'C'},
  {age: 1, type: 'science', name: 'Workshop', players: 3, resource_cost: ['G'], science: 'G'},
  {age: 1, type: 'science', name: 'Scriptorium', players: 3, resource_cost: ['P'], science: 'T'},
  {age: 1, type: 'basic_resource', name: 'Lumber Yard', players: 3, resources: ['W']},
  {age: 1, type: 'basic_resource', name: 'Stone Pit', players: 3, resources: ['S']},
  {age: 1, type: 'basic_resource', name: 'Clay Pool', players: 3, resources: ['B']},
  {age: 1, type: 'basic_resource', name: 'Ore Vein', players: 3, resources: ['O']},
  {age: 1, type: 'basic_resource', name: 'Clay Pit', players: 3, money_cost: 1, resources: [['B',  'O']]},
  {age: 1, type: 'basic_resource', name: 'Timber Yard', players: 3, money_cost: 1, resources: [['S',  'W']]},
  {age: 1, type: 'advanced_resource', name: 'Loom', players: 3, resources: ['L']},
  {age: 1, type: 'advanced_resource', name: 'Glassworks', players: 3, resources: ['G']},
  {age: 1, type: 'advanced_resource', name: 'Press', players: 3, resources: ['P']},
  {age: 1, type: 'victory', name: 'Pawnshop', players: 4, vps: 3},
  {age: 1, type: 'economy', name: 'Tavern', players: 4, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'military', name: 'Guard Tower', players: 4, resource_cost: ['B'], military: 1},
  {age: 1, type: 'science', name: 'Scriptorium', players: 4, resource_cost: ['P'], science: 'T'},
  {age: 1, type: 'basic_resource', name: 'Lumber Yard', players: 4, resources: ['W']},
  {age: 1, type: 'basic_resource', name: 'Ore Vein', players: 4, resources: ['O']},
  {age: 1, type: 'basic_resource', name: 'Excavation', players: 4, money_cost: 1, resources: [['S',  'B']]},
  {age: 1, type: 'victory', name: 'Altar', players: 5, vps: 2},
  {age: 1, type: 'economy', name: 'Tavern', players: 5, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'military', name: 'Barracks', players: 5, resource_cost: ['O'], military: 1},
  {age: 1, type: 'science', name: 'Apothecary', players: 5, resource_cost: ['L'], science: 'C'},
  {age: 1, type: 'basic_resource', name: 'Stone Pit', players: 5, resources: ['S']},
  {age: 1, type: 'basic_resource', name: 'Clay Pool', players: 5, resources: ['B']},
  {age: 1, type: 'basic_resource', name: 'Forest Cave', players: 5, money_cost: 1, resources: [['W',  'O']]},
  {age: 1, type: 'victory', name: 'Theater', players: 6, vps: 2},
  {age: 1, type: 'economy', name: 'Marketplace', players: 6, resources: effects.make_trading_resource(constants.NEIGHBORS, constants.ADVANCED_RESOURCES)},
  {age: 1, type: 'basic_resource', name: 'Tree Farm', players: 6, money_cost: 1, resources: [['W',  'B']]},
  {age: 1, type: 'basic_resource', name: 'Mine', players: 6, money_cost: 1, resources: [['O',  'S']]},
  {age: 1, type: 'advanced_resource', name: 'Loom', players: 6, resources: ['L']},
  {age: 1, type: 'advanced_resource', name: 'Glassworks', players: 6, resources: ['G']},
  {age: 1, type: 'advanced_resource', name: 'Press', players: 6, resources: ['P']},
  {age: 1, type: 'victory', name: 'Pawnshop', players: 7, vps: 3},
  {age: 1, type: 'victory', name: 'Baths', players: 7, resource_cost: ['S'], vps: 3},
  {age: 1, type: 'economy', name: 'Tavern', players: 7, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'economy', name: 'East Trading Post', players: 7, resources: effects.make_trading_resource(constants.LEFT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'West Trading Post', players: 7, resources: effects.make_trading_resource(constants.RIGHT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'military', name: 'Stockade', players: 7, resource_cost: ['W'], military: 1},
  {age: 1, type: 'science', name: 'Workshop', players: 7, resource_cost: ['G'], science: 'G'},

  {age: 2, type: 'victory', name: 'Aqueduct', players: 3, resource_cost: ['S', 'S', 'S'], upgrades_from: 'Baths', vps: 5},
  {age: 2, type: 'victory', name: 'Temple', players: 3, resource_cost: ['W', 'B', 'G'], upgrades_from: 'Altar', vps: 3},
  {age: 2, type: 'victory', name: 'Statue', players: 3, resource_cost: ['W', 'O', 'O'], upgrades_from: 'Theater', vps: 4},
  {age: 2, type: 'economy', name: 'Forum', players: 3, resource_cost: ['B', 'B'], resources: [['L', 'G', 'P']], upgrades_from: ['East Trading Post', 'West Trading Post']},
  {age: 2, type: 'economy', name: 'Caravansery', players: 3, resource_cost: ['W', 'W'], resources: [['B', 'S', 'O', 'W']], upgrades_from: 'Marketplace'},
  {age: 2, type: 'economy', name: 'Vineyard', players: 3, effect: effects.make_money_for_card_type_effect('basic_resource', constants.ALL, 1)},
  {age: 2, type: 'military', name: 'Walls', players: 3, resource_cost: ['S', 'S', 'S'], military: 2},
  {age: 2, type: 'military', name: 'Stables', players: 3, resource_cost: ['O', 'B', 'W'], upgrades_from: 'Apothecary', military: 2},
  {age: 2, type: 'military', name: 'Archery Range', players: 3, resource_cost: ['W', 'W', 'O'], upgrades_from: 'Workshop', military: 2},
  {age: 2, type: 'victory', name: 'Courthouse', players: 3, resource_cost: ['B', 'B', 'L'], upgrades_from: 'Scriptorium', vps: 4},
  {age: 2, type: 'science', name: 'Dispensary', players: 3, resource_cost: ['O', 'O', 'G'], upgrades_from: 'Apothecary', science: 'C'},
  {age: 2, type: 'science', name: 'Laboratory', players: 3, resource_cost: ['B', 'B', 'P'], upgrades_from: 'Workshop', science: 'G'},
  {age: 2, type: 'science', name: 'Library', players: 3, resource_cost: ['S', 'S', 'L'], upgrades_from: 'Scriptorium', science: 'T'},
  {age: 2, type: 'science', name: 'School', players: 3, resource_cost: ['W', 'P'], science: 'T'},
  {age: 2, type: 'basic_resource', name: 'Sawmill', players: 3, money_cost: 1, resources: ['W', 'W']},
  {age: 2, type: 'basic_resource', name: 'Quarry', players: 3, money_cost: 1, resources: ['S', 'S']},
  {age: 2, type: 'basic_resource', name: 'Brickyard', players: 3, money_cost: 1, resources: ['B', 'B']},
  {age: 2, type: 'basic_resource', name: 'Foundry', players: 3, money_cost: 1, resources: ['O', 'O']},
  {age: 2, type: 'advanced_resource', name: 'Loom', players: 3, resources: ['L']},
  {age: 2, type: 'advanced_resource', name: 'Glassworks', players: 3, resources: ['G']},
  {age: 2, type: 'advanced_resource', name: 'Press', players: 3, resources: ['P']},
  {age: 2, type: 'economy', name: 'Bazar', players: 4, effect: effects.make_money_for_card_type_effect('advanced_resource', constants.ALL, 2)},
  {age: 2, type: 'military', name: 'Training Ground', players: 4, resource_cost: ['W', 'O', 'O'], military: 2},
  {age: 2, type: 'science', name: 'Dispensary', players: 4, resource_cost: ['O', 'O', 'G'], upgrades_from: 'Apothecary', science: 'C'},
  {age: 2, type: 'basic_resource', name: 'Sawmill', players: 4, money_cost: 1, resources: ['W', 'W']},
  {age: 2, type: 'basic_resource', name: 'Quarry', players: 4, money_cost: 1, resources: ['S', 'S']},
  {age: 2, type: 'basic_resource', name: 'Brickyard', players: 4, money_cost: 1, resources: ['B', 'B']},
  {age: 2, type: 'basic_resource', name: 'Foundry', players: 4, money_cost: 1, resources: ['O', 'O']},
  {age: 2, type: 'economy', name: 'Caravansery', players: 5, resource_cost: ['W', 'W'], resources: [['B', 'S', 'O', 'W']], upgrades_from: 'Marketplace'},
  {age: 2, type: 'military', name: 'Stables', players: 5, resource_cost: ['O', 'B', 'W'], upgrades_from: 'Apothecary', military: 2},
  {age: 2, type: 'victory', name: 'Courthouse', players: 5, resource_cost: ['B', 'B', 'L'], upgrades_from: 'Scriptorium', vps: 4},
  {age: 2, type: 'science', name: 'Laboratory', players: 5, resource_cost: ['B', 'B', 'P'], upgrades_from: 'Workshop', science: 'G'},
  {age: 2, type: 'advanced_resource', name: 'Loom', players: 5, resources: ['L']},
  {age: 2, type: 'advanced_resource', name: 'Glassworks', players: 5, resources: ['G']},
  {age: 2, type: 'advanced_resource', name: 'Press', players: 5, resources: ['P']},
  {age: 2, type: 'victory', name: 'Temple', players: 6, resource_cost: ['W', 'B', 'G'], upgrades_from: 'Altar', vps: 3},
  {age: 2, type: 'economy', name: 'Forum', players: 6, resource_cost: ['B', 'B'], resources: [['L', 'G', 'P']], upgrades_from: ['East Trading Post', 'West Trading Post']},
  {age: 2, type: 'economy', name: 'Caravansery', players: 6, resource_cost: ['W', 'W'], resources: [['B', 'S', 'O', 'W']], upgrades_from: 'Marketplace'},
  {age: 2, type: 'economy', name: 'Vineyard', players: 6, effect: effects.make_money_for_card_type_effect('basic_resource', constants.ALL, 1)},
  {age: 2, type: 'military', name: 'Training Ground', players: 6, resource_cost: ['W', 'O', 'O'], military: 2},
  {age: 2, type: 'military', name: 'Archery Range', players: 6, resource_cost: ['W', 'W', 'O'], upgrades_from: 'Workshop', military: 2},
  {age: 2, type: 'science', name: 'Library', players: 6, resource_cost: ['S', 'S', 'L'], upgrades_from: 'Scriptorium', science: 'T'},
  {age: 2, type: 'victory', name: 'Aqueduct', players: 7, resource_cost: ['S', 'S', 'S'], upgrades_from: 'Baths', vps: 5},
  {age: 2, type: 'victory', name: 'Statue', players: 7, resource_cost: ['W', 'O', 'O'], upgrades_from: 'Theater', vps: 4},
  {age: 2, type: 'economy', name: 'Forum', players: 7, resource_cost: ['B', 'B'], resources: [['L', 'G', 'P']], upgrades_from: ['East Trading Post', 'West Trading Post']},
  {age: 2, type: 'economy', name: 'Bazar', players: 7, effect: effects.make_money_for_card_type_effect('advanced_resource', constants.ALL, 2)},
  {age: 2, type: 'military', name: 'Walls', players: 7, resource_cost: ['S', 'S', 'S'], military: 2},
  {age: 2, type: 'military', name: 'Training Ground', players: 7, resource_cost: ['W', 'O', 'O'], military: 2},
  {age: 2, type: 'science', name: 'School', players: 7, resource_cost: ['W', 'P'], science: 'T'},

  {age: 3, type: 'victory', name: 'Pantheon', players: 3, resource_cost: ['B', 'B', 'O', 'P', 'L', 'G'], upgrades_from: 'Temple', vps: 7},
  {age: 3, type: 'victory', name: 'Gardens', players: 3, resource_cost: ['W', 'B', 'B'], upgrades_from: 'Statue', vps: 5},
  {age: 3, type: 'victory', name: 'Townhall', players: 3, resource_cost: ['G', 'O', 'S', 'S'], vps: 6},
  {age: 3, type: 'victory', name: 'Palace', players: 3, vps: 8, resource_cost: ['G', 'P', 'L', 'B', 'W', 'O', 'S']},
  { age: 3, type: 'economy', name: 'Haven', players: 3,
    resource_cost: ['L', 'O', 'W'],
    upgrades_from: 'Forum',
    effect: effects.make_money_for_card_type_effect('basic_resource', constants.SELF, 1),
    vps: effects.make_vps_for_card_type_effect('basic_resource', constants.SELF, 1)
  },
  { age: 3, type: 'economy', name: 'Lighthouse', players: 3,
    resource_cost: ['G', 'S'],
    upgrades_from: 'Caravansery',
    effect: effects.make_money_for_card_type_effect('economy', constants.SELF, 1),
    effect: effects.make_vps_for_card_type_effect('economy', constants.SELF, 1)
  },
  {age: 3, type: 'military', name: 'Fortifications', players: 3, resource_cost: ['S', 'O', 'O', 'O'], upgrades_from: 'Walls', military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 3, resource_cost: ['O', 'W', 'W', 'L'], military: 3},
  {age: 3, type: 'military', name: 'Siege Workshop', players: 3, resource_cost: ['W', 'B', 'B', 'B'], upgrades_from: 'Laboratory', military: 3},
  { age: 3, type: 'economy', name: 'Arena', players: 3,
    resource_cost: ['O', 'S', 'S'],
    upgrades_from: 'Dispensary',
    effect: effects.make_money_for_wonder_stages_effect(constants.SELF, 3),
    vps: effects.make_vps_for_wonder_stages_effect(constants.SELF, 1),
  },
  {age: 3, type: 'victory', name: 'Senate', players: 3, resource_cost: ['O', 'S', 'W', 'W'], upgrades_from: 'Library', vps: 6},
  {age: 3, type: 'science', name: 'Lodge', players: 3, resource_cost: ['B', 'B', 'L', 'P'], upgrades_from: 'Dispensary', science: 'C'},
  {age: 3, type: 'science', name: 'Observatory', players: 3, resource_cost: ['S', 'S', 'P', 'G'], upgrades_from: 'Laboratory', science: 'G'},
  {age: 3, type: 'science', name: 'University', players: 3, resource_cost: ['W', 'W', 'P', 'G'], upgrades_from: 'Library', science: 'T'},
  {age: 3, type: 'science', name: 'Academy', players: 3, resource_cost: ['S', 'S', 'S', 'G'], upgrades_from: 'School', science: 'C'},
  {age: 3, type: 'science', name: 'Study', players: 3, resource_cost: ['W', 'P', 'G'], upgrades_from: 'School', science: 'G'},
  {age: 3, type: 'victory', name: 'Gardens', players: 4, resource_cost: ['W', 'B', 'B'], upgrades_from: 'Statue', vps: 5},
  { age: 3, type: 'economy', name: 'Haven', players: 4,
    resource_cost: ['L', 'O', 'W'],
    upgrades_from: 'Forum',
    effect: effects.make_money_for_card_type_effect('basic_resource', constants.SELF, 1),
    vps: effects.make_vps_for_card_type_effect('basic_resource', constants.SELF, 1)
  },
  { age: 3, type: 'economy', name: 'Chamber of Commerce', players: 4,
    resource_cost: ['B', 'B', 'P'],
    effect: effects.make_money_for_card_type_effect('advanced_resource', constants.SELF, 2),
    effect: effects.make_vps_for_card_type_effect('advanced_resource', constants.SELF, 2)
  },
  {age: 3, type: 'military', name: 'Circus', players: 4, resource_cost: ['S', 'S', 'S', 'O'], upgrades_from: 'Training Ground', military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 4, resource_cost: ['O', 'W', 'W', 'L'], military: 3},
  {age: 3, type: 'science', name: 'University', players: 4, resource_cost: ['W', 'W', 'P', 'G'], upgrades_from: 'Library', science: 'T'},
  {age: 3, type: 'victory', name: 'Townhall', players: 5, resource_cost: ['G', 'O', 'S', 'S'], vps: 6},
  {age: 3, type: 'military', name: 'Circus', players: 5, resource_cost: ['S', 'S', 'S', 'O'], upgrades_from: 'Training Ground', military: 3},
  {age: 3, type: 'military', name: 'Siege Workshop', players: 5, resource_cost: ['W', 'B', 'B', 'B'], upgrades_from: 'Laboratory', military: 3},
  { age: 3, type: 'economy', name: 'Arena', players: 5,
    resource_cost: ['O', 'S', 'S'],
    upgrades_from: 'Dispensary',
    effect: effects.make_money_for_wonder_stages_effect(constants.SELF, 3),
    vps: effects.make_vps_for_wonder_stages_effect(constants.SELF, 1),
  },
  {age: 3, type: 'victory', name: 'Senate', players: 5, resource_cost: ['O', 'S', 'W', 'W'], upgrades_from: 'Library', vps: 6},
  {age: 3, type: 'science', name: 'Study', players: 5, resource_cost: ['W', 'P', 'G'], upgrades_from: 'School', science: 'G'},
  {age: 3, type: 'victory', name: 'Pantheon', players: 6, resource_cost: ['B', 'B', 'O', 'P', 'L', 'G'], upgrades_from: 'Temple', vps: 7},
  {age: 3, type: 'victory', name: 'Townhall', players: 6, resource_cost: ['G', 'O', 'S', 'S'], vps: 6},
  { age: 3, type: 'economy', name: 'Lighthouse', players: 6,
    resource_cost: ['G', 'S'],
    upgrades_from: 'Caravansery',
    effect: effects.make_money_for_card_type_effect('economy', constants.SELF, 1),
    effect: effects.make_vps_for_card_type_effect('economy', constants.SELF, 1)
  },
  { age: 3, type: 'economy', name: 'Chamber of Commerce', players: 6,
    resource_cost: ['B', 'B', 'P'],
    effect: effects.make_money_for_card_type_effect('advanced_resource', constants.SELF, 2),
    effect: effects.make_vps_for_card_type_effect('advanced_resource', constants.SELF, 2)
  },
  {age: 3, type: 'military', name: 'Circus', players: 6, resource_cost: ['S', 'S', 'S', 'O'], upgrades_from: 'Training Ground', military: 3},
  {age: 3, type: 'science', name: 'Lodge', players: 6, resource_cost: ['B', 'B', 'L', 'P'], upgrades_from: 'Dispensary', science: 'C'},
  {age: 3, type: 'victory', name: 'Palace', players: 7, vps: 8, resource_cost: ['G', 'P', 'L', 'B', 'W', 'O', 'S']},
  {age: 3, type: 'military', name: 'Fortifications', players: 7, resource_cost: ['S', 'O', 'O', 'O'], upgrades_from: 'Walls', military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 7, resource_cost: ['O', 'W', 'W', 'L'], military: 3},
  { age: 3, type: 'economy', name: 'Arena', players: 7,
    resource_cost: ['O', 'S', 'S'],
    upgrades_from: 'Dispensary',
    effect: effects.make_money_for_wonder_stages_effect(constants.SELF, 3),
    vps: effects.make_vps_for_wonder_stages_effect(constants.SELF, 1),
  },
  {age: 3, type: 'science', name: 'Observatory', players: 7, resource_cost: ['S', 'S', 'P', 'G'], upgrades_from: 'Laboratory', science: 'G'},
  {age: 3, type: 'science', name: 'Academy', players: 7, resource_cost: ['S', 'S', 'S', 'G'], upgrades_from: 'School', science: 'C'},

  { age: 'guild', type: 'guild', name: 'Workers Guild',
    resource_cost: ['O', 'O', 'B', 'S', 'W'],
    vps: effects.make_vps_for_card_type_effect('basic_resource', constants.NEIGHBORS, 1)
  },
  { age: 'guild', type: 'guild', name: 'Craftsmens Guild',
    resource_cost: ['O', 'O', 'S', 'S'],
    vps: effects.make_vps_for_card_type_effect('advanced_resource', constants.NEIGHBORS, 2)
  },
  { age: 'guild', type: 'guild', name: 'Traders Guild',
    resource_cost: ['L', 'P', 'G'],
    vps: effects.make_vps_for_card_type_effect('economy', constants.NEIGHBORS, 1)
  },
  { age: 'guild', type: 'guild', name: 'Philosophers Guild',
    resource_cost: ['B', 'B', 'B', 'L', 'P'],
    vps: effects.make_vps_for_card_type_effect('science', constants.NEIGHBORS, 1)
  },
  { age: 'guild', type: 'guild', name: 'Spies Guild',
    resource_cost: ['B', 'B', 'B', 'G'],
    vps: effects.make_vps_for_card_type_effect('military', constants.NEIGHBORS, 1)
  },
  { age: 'guild', type: 'guild', name: 'Stategists Guild',
    resource_cost: ['O', 'O', 'S', 'L'],
    vps: effects.vps_for_neighbor_military_losses,
  },
  { age: 'guild', type: 'guild', name: 'Shipowners Guild',
    resource_cost: ['W', 'W', 'W', 'P', 'G'],
    effect: effects.make_sum_vps_effect([
      effects.make_vps_for_card_type_effect('basic_resource', constants.SELF, 1),
      effects.make_vps_for_card_type_effect('advanced_resource', constants.SELF, 1),
      effects.make_vps_for_card_type_effect('guild', constants.SELF, 1),
    ])
  },
  { age: 'guild', type: 'guild', name: 'Scientists Guild',
    resource_cost: ['W', 'W', 'O', 'O', 'P'],
    science: ['C', 'G', 'T']
  },
  { age: 'guild', type: 'guild', name: 'Magistrates Guild',
    resource_cost: ['W', 'W', 'W', 'S', 'L'],
    vps: effects.make_vps_for_card_type_effect('victory', constants.NEIGHBORS, 1)
  },
  { age: 'guild', type: 'guild', name: 'Builders Guild',
    resource_cost: ['S', 'S', 'B', 'B', 'G'],
    vps: effects.make_vps_for_wonder_stages_effect(constants.ALL, 1)
  },
];

// give each card a unique id
cards = _.map(cards, function (card) {
  card.id = _.uniqueId();
  return card;
});

exports.cards = cards;
exports.wrapWonderStage = function (stage, card) {
  var wrapper = {
    age: 'wonder',
    type: 'wonder',
    name: 'Wonder Upgrade',
    wrapped_card: card,
    id: _.uniqueId(),
  };
  return _.extend(wrapper, stage);
};

exports.wrapWonderResource = function (resource) {
  return wrapper = {
    age: 'wonder',
    type: 'wonder-resource',
    name: 'Wonder Resource',
    resources: [resource],
    id: _.uniqueId(),
  };
};
