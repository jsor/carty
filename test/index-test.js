var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty", function() {
    it("is cart factory", function() {
        var cart = carty();

        assert.isFunction(cart.add);
    });

    it("exposes item() method", function() {
        var item = carty.item('Item');

        assert.isFunction(item);
        assert.isFunction(item.id);
        assert.strictEqual(item.id(), 'Item');
    });
});
