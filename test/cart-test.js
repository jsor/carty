var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart()", function() {
    it("does not expose the emit() method", function() {
        assert.isUndefined(cart().emit);
    });

    it("ready() accepts no callbacks", function(done) {
        cart()
            .add('Item2')
            .ready()
            .ready(function() {
                done();
            })
        ;
    });
});
