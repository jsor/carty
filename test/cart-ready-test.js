var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().ready()", function() {
    it("can be called without arguments", function(done) {
        cart()
            .add('Item2')
            .ready()
            .ready(function() {
                done();
            })
        ;
    });
});
