var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().has()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
    });

    it("returns true for existing item", function(done) {
        instance
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
                done();
            })
        ;
    });

    it("returns true for existing item passed as string", function(done) {
        instance
            .ready(function() {
                assert.isTrue(instance.has('Item'));
                done();
            })
        ;
    });

    it("returns false for missing item", function(done) {
        instance
            .ready(function() {
                assert.isFalse(instance.has({id: 'Missing'}));
                done();
            })
        ;
    });

    it("returns false for missing item passed as string", function(done) {
        instance
            .ready(function() {
                assert.isFalse(instance.has('Missing'));
                done();
            })
        ;
    });

    it("returns false for invalid item", function(done) {
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
                assert.isTrue(instance.has({id: 'Item with quantity', quantity: 2}));
                done();
            })
        ;
    });
});
