var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().has", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
    });

    it("returns true for existing item", function() {
        assert(instance.has({id: 'Item'}));
    });

    it("returns true for existing item passed as string", function() {
        assert(instance.has('Item'));
    });

    it("returns false for missing item", function() {
        assert.isFalse(instance.has({id: 'Missing'}));
    });

    it("returns false for missing item passed as string", function() {
        assert.isFalse(instance.has('Missing'));
    });

    it("returns false for invalid item", function() {
        assert.isFalse(instance.has({}));
        assert.isFalse(instance.has({foo: 'bar'}));
        assert.isFalse(instance.has([]));
        assert.isFalse(instance.has(null));
        assert.isFalse(instance.has(undefined));
    });

    it("ignores quantity", function() {
        instance.add({id: 'Item with quantity', quantity: 1});
        assert(instance.has({id: 'Item with quantity', quantity: 2}));
    });
});
