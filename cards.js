var constants = require('./constants');
var effects = require('./effects');

var cards = [
  {age: 1, type: 'victory', name: 'Baths', players: 3, vps: 3},
  {age: 1, type: 'victory', name: 'Altar', players: 3, vps: 2},
  {age: 1, type: 'victory', name: 'Theater', players: 3, vps: 2},
  {age: 1, type: 'economy', name: 'East Trading Post', players: 3, resources: effects.make_trading_resource(constants.LEFT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'West Trading Post', players: 3, resources: effects.make_trading_resource(constants.RIGHT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'Marketplace', players: 3, resources: effects.make_trading_resource(constants.NEIGHBORS, constants.ADVANCED_RESOURCES)},
  {age: 1, type: 'military', name: 'Stockade', players: 3, military: 1},
  {age: 1, type: 'military', name: 'Barracks', players: 3, military: 1},
  {age: 1, type: 'military', name: 'Guard Tower', players: 3, military: 1},
  {age: 1, type: 'science', name: 'Apothecary', players: 3, science: 'C'},
  {age: 1, type: 'science', name: 'Workshop', players: 3, science: 'G'},
  {age: 1, type: 'science', name: 'Scriptorium', players: 3, science: 'T'},
  {age: 1, type: 'basic_resource', name: 'Lumber Yard', players: 3, resources: ['W']},
  {age: 1, type: 'basic_resource', name: 'Stone Pit', players: 3, resources: ['S']},
  {age: 1, type: 'basic_resource', name: 'Clay Pool', players: 3, resources: ['B']},
  {age: 1, type: 'basic_resource', name: 'Ore Vein', players: 3, resources: ['O']},
  {age: 1, type: 'basic_resource', name: 'Clay Pit', players: 3, resources: [['B',  'O']]},
  {age: 1, type: 'basic_resource', name: 'Timber Yard', players: 3, resources: [['S',  'W']]},
  {age: 1, type: 'advanced_resource', name: 'Loom', players: 3, resources: ['L']},
  {age: 1, type: 'advanced_resource', name: 'Glassworks', players: 3, resources: ['G']},
  {age: 1, type: 'advanced_resource', name: 'Press', players: 3, resources: ['P']},
  {age: 1, type: 'victory', name: 'Pawnshop', players: 4, vps: 3},
  {age: 1, type: 'economy', name: 'Tavern', players: 4, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'military', name: 'Guard Tower', players: 4, military: 1},
  {age: 1, type: 'science', name: 'Scriptorium', players: 4, science: 'T'},
  {age: 1, type: 'basic_resource', name: 'Lumber Yard', players: 4, resources: ['W']},
  {age: 1, type: 'basic_resource', name: 'Ore Vein', players: 4, resources: ['O']},
  {age: 1, type: 'basic_resource', name: 'Excavation', players: 4, resources: [['S',  'B']]},
  {age: 1, type: 'victory', name: 'Altar', players: 5, vps: 2},
  {age: 1, type: 'economy', name: 'Tavern', players: 5, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'military', name: 'Barracks', players: 5, military: 1},
  {age: 1, type: 'science', name: 'Apothecary', players: 5, science: 'C'},
  {age: 1, type: 'basic_resource', name: 'Stone Pit', players: 5, resources: ['S']},
  {age: 1, type: 'basic_resource', name: 'Clay Pool', players: 5, resources: ['B']},
  {age: 1, type: 'basic_resource', name: 'Forest Cave', players: 5, resources: [['W',  'O']]},
  {age: 1, type: 'victory', name: 'Theater', players: 6, vps: 2},
  {age: 1, type: 'economy', name: 'Marketplace', players: 6, resources: effects.make_trading_resource(constants.NEIGHBORS, constants.ADVANCED_RESOURCES)},
  {age: 1, type: 'basic_resource', name: 'Tree Farm', players: 6, resources: [['W',  'B']]},
  {age: 1, type: 'basic_resource', name: 'Mine', players: 6, resources: [['O',  'S']]},
  {age: 1, type: 'advanced_resource', name: 'Loom', players: 6, resources: ['L']},
  {age: 1, type: 'advanced_resource', name: 'Glassworks', players: 6, resources: ['G']},
  {age: 1, type: 'advanced_resource', name: 'Press', players: 6, resources: ['P']},
  {age: 1, type: 'victory', name: 'Pawnshop', players: 7, vps: 3},
  {age: 1, type: 'victory', name: 'Baths', players: 7, vps: 3},
  {age: 1, type: 'economy', name: 'Tavern', players: 7, effect: effects.make_give_money_effect(5)},
  {age: 1, type: 'economy', name: 'East Trading Post', players: 7, resources: effects.make_trading_resource(constants.LEFT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'economy', name: 'West Trading Post', players: 7, resources: effects.make_trading_resource(constants.RIGHT, constants.BASIC_RESOURCES)},
  {age: 1, type: 'military', name: 'Stockade', players: 7, military: 1},
  {age: 1, type: 'science', name: 'Workshop', players: 7, science: 'G'},

  {age: 2, type: 'victory', name: 'Aquaduct', players: 3, vps: 5},
  {age: 2, type: 'victory', name: 'Temple', players: 3, vps: 3},
  {age: 2, type: 'victory', name: 'Statue', players: 3, vps: 4},
  {age: 2, type: 'economy', name: 'Forum', players: 3, resources: [['L', 'G', 'P']]},
  {age: 2, type: 'economy', name: 'Caravansery', players: 3, resources: [['B', 'S', 'O', 'W']]},
  {age: 2, type: 'economy', name: 'Vineyard', players: 3, effect: effects.make_money_for_card_type_effect('basic_resource', constants.ALL, 1)},
  {age: 2, type: 'military', name: 'Walls', players: 3, military: 2},
  {age: 2, type: 'military', name: 'Stables', players: 3, military: 2},
  {age: 2, type: 'military', name: 'Archery Range', players: 3, military: 2},
  {age: 2, type: 'victory', name: 'Courthouse', players: 3, vps: 4},
  {age: 2, type: 'science', name: 'Dispensary', players: 3, science: 'C'},
  {age: 2, type: 'science', name: 'Laboratory', players: 3, science: 'G'},
  {age: 2, type: 'science', name: 'Library', players: 3, science: 'T'},
  {age: 2, type: 'science', name: 'School', players: 3, science: 'T'},
  {age: 2, type: 'basic_resource', name: 'Sawmill', players: 3, resources: ['W', 'W']},
  {age: 2, type: 'basic_resource', name: 'Quarry', players: 3, resources: ['S', 'S']},
  {age: 2, type: 'basic_resource', name: 'Brickyard', players: 3, resources: ['B', 'B']},
  {age: 2, type: 'basic_resource', name: 'Foundary', players: 3, resources: ['O', 'O']},
  {age: 2, type: 'advanced_resource', name: 'Loom', players: 3, resources: ['L']},
  {age: 2, type: 'advanced_resource', name: 'Glassworks', players: 3, resources: ['G']},
  {age: 2, type: 'advanced_resource', name: 'Press', players: 3, resources: ['P']},
  {age: 2, type: 'economy', name: 'Bazar', players: 4, effect: effects.make_money_for_card_type_effect('advanced_resource', constants.ALL, 2)},
  {age: 2, type: 'military', name: 'Training Ground', players: 4, military: 2},
  {age: 2, type: 'science', name: 'Dispensary', players: 4, science: 'C'},
  {age: 2, type: 'basic_resource', name: 'Sawmill', players: 4, resources: ['W', 'W']},
  {age: 2, type: 'basic_resource', name: 'Quarry', players: 4, resources: ['S', 'S']},
  {age: 2, type: 'basic_resource', name: 'Brickyard', players: 4, resources: ['B', 'B']},
  {age: 2, type: 'basic_resource', name: 'Foundary', players: 4, resources: ['O', 'O']},
  {age: 2, type: 'economy', name: 'Caravansery', players: 5, resources: [['B', 'S', 'O', 'W']]},
  {age: 2, type: 'military', name: 'Stables', players: 5, military: 2},
  {age: 2, type: 'victory', name: 'Courthouse', players: 5, vps: 4},
  {age: 2, type: 'science', name: 'Laboratory', players: 5, science: 'G'},
  {age: 2, type: 'advanced_resource', name: 'Loom', players: 5, resources: ['L']},
  {age: 2, type: 'advanced_resource', name: 'Glassworks', players: 5, resources: ['G']},
  {age: 2, type: 'advanced_resource', name: 'Press', players: 5, resources: ['P']},
  {age: 2, type: 'victory', name: 'Temple', players: 6, vps: 3},
  {age: 2, type: 'economy', name: 'Forum', players: 6, resources: [['L', 'G', 'P']]},
  {age: 2, type: 'economy', name: 'Caravansery', players: 6, resources: [['B', 'S', 'O', 'W']]},
  {age: 2, type: 'economy', name: 'Vineyard', players: 6, effect: effects.make_money_for_card_type_effect('basic_resource', constants.ALL, 1)},
  {age: 2, type: 'military', name: 'Training Ground', players: 6, military: 2},
  {age: 2, type: 'military', name: 'Archery Range', players: 6, military: 2},
  {age: 2, type: 'science', name: 'Library', players: 6, science: 'T'},
  {age: 2, type: 'victory', name: 'Aquaduct', players: 7, vps: 5},
  {age: 2, type: 'victory', name: 'Statue', players: 7, vps: 4},
  {age: 2, type: 'economy', name: 'Forum', players: 7, resources: [['L', 'G', 'P']]},
  {age: 2, type: 'economy', name: 'Bazar', players: 7, effect: effects.make_money_for_card_type_effect('advanced_resource', constants.ALL, 2)},
  {age: 2, type: 'military', name: 'Walls', players: 7, military: 2},
  {age: 2, type: 'military', name: 'Training Ground', players: 7, military: 2},
  {age: 2, type: 'science', name: 'School', players: 7, science: 'T'},

  {age: 3, type: 'victory', name: 'Pantheon', players: 3, vps: 7},
  {age: 3, type: 'victory', name: 'Gardens', players: 3, vps: 5},
  {age: 3, type: 'victory', name: 'Townhall', players: 3, vps: 6},
  {age: 3, type: 'victory', name: 'Palace', players: 3, vps: 8},
  {age: 3, type: 'economy', name: 'Haven', players: 3},
  {age: 3, type: 'economy', name: 'Lighthouse', players: 3},
  {age: 3, type: 'military', name: 'Fortificatins', players: 3, military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 3, military: 3},
  {age: 3, type: 'military', name: 'Siege Workshop', players: 3, military: 3},
  {age: 3, type: 'economy', name: 'Arena', players: 3},
  {age: 3, type: 'victory', name: 'Senate', players: 3, vps: 6},
  {age: 3, type: 'science', name: 'Lodge', players: 3, science: 'C'},
  {age: 3, type: 'science', name: 'Observatory', players: 3, science: 'G'},
  {age: 3, type: 'science', name: 'University', players: 3, science: 'T'},
  {age: 3, type: 'science', name: 'Academy', players: 3, science: 'C'},
  {age: 3, type: 'science', name: 'Study', players: 3, science: 'G'},
  {age: 3, type: 'victory', name: 'Gardens', players: 4, vps: 5},
  {age: 3, type: 'economy', name: 'Haven', players: 4},
  {age: 3, type: 'economy', name: 'Chamber of Commerce', players: 4},
  {age: 3, type: 'military', name: 'Circus', players: 4, military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 4, military: 3},
  {age: 3, type: 'science', name: 'University', players: 4, science: 'T'},
  {age: 3, type: 'victory', name: 'Townhall', players: 5, vps: 6},
  {age: 3, type: 'military', name: 'Circus', players: 5, military: 3},
  {age: 3, type: 'military', name: 'Siege Workshop', players: 5, military: 3},
  {age: 3, type: 'economy', name: 'Arena', players: 5},
  {age: 3, type: 'victory', name: 'Senate', players: 5, vps: 6},
  {age: 3, type: 'science', name: 'Study', players: 5, science: 'G'},
  {age: 3, type: 'victory', name: 'Pantheon', players: 6, vps: 7},
  {age: 3, type: 'victory', name: 'Townhall', players: 6, vps: 6},
  {age: 3, type: 'economy', name: 'Lighthouse', players: 6},
  {age: 3, type: 'economy', name: 'Chamber of Commerce', players: 6},
  {age: 3, type: 'military', name: 'Circus', players: 6, military: 3},
  {age: 3, type: 'science', name: 'Lodge', players: 6, science: 'C'},
  {age: 3, type: 'victory', name: 'Palace', players: 7, vps: 8},
  {age: 3, type: 'military', name: 'Fortificatins', players: 7, military: 3},
  {age: 3, type: 'military', name: 'Arsenal', players: 7, military: 3},
  {age: 3, type: 'economy', name: 'Arena', players: 7},
  {age: 3, type: 'science', name: 'Observatory', players: 7, science: 'G'},
  {age: 3, type: 'science', name: 'Academy', players: 7, science: 'C'},

  {age: 'guild', type: 'guild', name: 'Workers Guild'},
  {age: 'guild', type: 'guild', name: 'Craftsmens Guild'},
  {age: 'guild', type: 'guild', name: 'Traders Guild'},
  {age: 'guild', type: 'guild', name: 'Philosophers Guild'},
  {age: 'guild', type: 'guild', name: 'Spies Guild'},
  {age: 'guild', type: 'guild', name: 'Stategists Guild'},
  {age: 'guild', type: 'guild', name: 'Shiowners Guild'},
  {age: 'guild', type: 'guild', name: 'Scientists Guild'},
  {age: 'guild', type: 'guild', name: 'Magistrates Guild'},
  {age: 'guild', type: 'guild', name: 'Builders Guild'},
];

exports.cards = cards;
