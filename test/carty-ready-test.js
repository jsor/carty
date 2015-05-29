var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().ready()", function() {
    it("throws uncaught errors", function(done) {
        carty()
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

describe("carty().error()", function() {
    it("receives thrown exceptions from previous ready()", function(done) {
        carty()
            .ready(function() {
                throw "foo";
            })
            .error(function(e) {
                assert.strictEqual(e, "foo");
            })
            .ready(function() {
                done();
            })
        ;
    });
});
