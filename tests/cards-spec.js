var _ = require('underscore');
var Cards = require('../cards');

describe('card data sanity', function () {
  it('every upgrades_from should be a valid card', function () {
    // build set of cards
    var name_set = {};
    _.each(Cards.cards, function (card) {
      name_set[card.name] = true;
    });

    _.each(Cards.cards, function (card) {
      if (card.upgrades_from) {
        var names = Array.isArray(card.upgrades_from) ?
          card.upgrades_from :
          [card.upgrades_from];
        _.each(names, function (name) {
          if (!name_set[name]) {
            console.log('doh', name);
          }
          expect(name_set[name]).toBeDefined();
        });
      }
    });
  });
});
