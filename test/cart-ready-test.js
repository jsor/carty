var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().ready()", function() {
    it("throws uncaught errors", function(done) {
        cart()
            .ready(function() {
                throw "foo";
            })
            .ready(function() {
            })
        ;

        setTimeout(function() {
           assert.throws(function() {
               done();
           }, "foo")
        });
    });
});

describe("cart().error()", function() {
    it("receives thrown exceptions from previous ready()", function(done) {
        cart()
            .ready(function() {
                throw "foo";
            })
            .error(function(e) {
                assert.strictEqual(e, "foo")
                done();
            })
        ;
    });
});
