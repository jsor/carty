var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().get", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
    });

    it("returns existing item", function() {
        var item = instance.get({id: 'Item'});
        assert.strictEqual(item.id(), 'Item');
    });

    it("returns existing item passed as string", function() {
        var item = instance.get('Item');
        assert.strictEqual(item.id(), 'Item');
    });

    it("returns null for missing item", function() {
        assert.isNull(instance.get({id: 'Missing'}));
    });

    it("returns null for missing item passed as string", function() {
        assert.isNull(instance.get('Missing'));
    });

    it("returns null for invalid item", function() {
        assert.isFalse(instance.has({}));
        assert.isFalse(instance.has({foo: 'bar'}));
        assert.isFalse(instance.has([]));
        assert.isFalse(instance.has(null));
        assert.isFalse(instance.has(undefined));
    });

    it("ignores quantity", function() {
        instance.add({id: 'Item with quantity', quantity: 1});

        var item = instance.get({id: 'Item with quantity', quantity: 2});
        assert.strictEqual(item.id(), 'Item with quantity');
    });
});
