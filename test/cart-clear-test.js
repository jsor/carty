var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("cart().clear()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}, {id: 'Item2'}]; },
                add: function (item, items) { },
                update: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("removes all items", function(done) {
        cart
            .clear()
            .ready(function() {
                assert.strictEqual(cart.size(), 0);

                var count = 0;
                cart.each(function() {
                    count++;
                });

                assert.strictEqual(count, 0);

                assert.strictEqual(cart().items.length, 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits clear event", function(done) {
        cart.on('clear', function() {
            done();
        });

        cart.clear();
    });

    it("aborts if clear event listener returns false", function(done) {
        cart.on('clear', function() {
            return false;
        });

        cart
            .clear()
            .ready(function() {
                assert.strictEqual(cart.size(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits cleared event", function(done) {
        cart.on('cleared', function() {
            done();
        });

        cart.clear();
    });

    it("emits clearfailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                clear: function() { return Promise.reject('error'); }
            }
        });

        cart.on('clearfailed', function(error) {
            assert.strictEqual(error, 'error')
            done();
        });

        cart.clear();
    });

    it("emits change event", function(done) {
        cart.on('change', function() {
            done();
        });

        cart.clear();
    });

    it("emits changed event", function(done) {
        cart.on('changed', function() {
            done();
        });

        cart.clear();
    });

    it("emits changefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                clear: function() { return Promise.reject('error'); }
            }
        });

        cart.on('changefailed', function() {
            done();
        });

        cart.clear();
    });
});
