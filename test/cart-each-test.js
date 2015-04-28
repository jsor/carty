var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().each()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
        cart.add({id: 'Item'});
        cart.add({id: 'Item2'});
    });

    it("iterates over all items", function(done) {
        cart
            .ready(function() {
                var count = 0;
                cart.each(function() {
                    count++;
                });

                assert.strictEqual(count, 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts iteration if callback returns false", function(done) {
        cart
            .ready(function() {
                var count = 0;
                cart.each(function() {
                    count++;
                    return false;
                });

                assert.strictEqual(count, 1);
            })
            .ready(function() {
                done();
            })
        ;
    });
});
