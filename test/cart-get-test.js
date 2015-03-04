var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().get", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
    });

    it("returns existing item", function(done) {
        instance
            .ready(function() {
                var item = instance.get({id: 'Item'});
                assert.strictEqual(item.id(), 'Item');
                done();
            })
        ;
    });

    it("returns existing item passed as string", function(done) {
        instance
            .ready(function() {
                var item = instance.get('Item');
                assert.strictEqual(item.id(), 'Item');
                done();
            })
        ;
    });

    it("returns null for missing item", function(done) {
        instance
            .ready(function() {
                assert.isNull(instance.get({id: 'Missing'}));
                done();
            })
        ;
    });

    it("returns null for missing item passed as string", function(done) {
        instance
            .ready(function() {
                assert.isNull(instance.get('Missing'));
                done();
            })
        ;
    });

    it("returns null for invalid item", function(done) {
        instance
            .ready(function() {
                assert.isFalse(instance.has({}));
                assert.isFalse(instance.has({foo: 'bar'}));
                assert.isFalse(instance.has([]));
                assert.isFalse(instance.has(null));
                assert.isFalse(instance.has(undefined));
                done();
            })
        ;
    });

    it("ignores quantity", function(done) {
        instance
            .add({id: 'Item with quantity', quantity: 1})
            .ready(function() {
                var item = instance.get({id: 'Item with quantity', quantity: 2});
                assert.strictEqual(item.id(), 'Item with quantity');
                done();
            })
        ;
    });
});
