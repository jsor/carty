var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().each()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
        instance.add({id: 'Item2'});
    });

    it("iterates over all items", function(done) {
        instance
            .ready(function() {
                var count = 0;
                instance.each(function() {
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
        instance
            .ready(function() {
                var count = 0;
                instance.each(function() {
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
