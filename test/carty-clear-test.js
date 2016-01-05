var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().clear()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}, {id: 'Item2'}]; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("removes all items", function(done) {
        cart
            .clear()
            .ready(function(cart) {
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
        var spy = sinon.spy();

        cart.on('clear', spy);

        cart
            .clear()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts if clear event listener returns false", function(done) {
        cart.on('clear', function() {
            return false;
        });

        cart
            .clear()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits cleared event", function(done) {
        var spy = sinon.spy();

        cart.on('cleared', spy);

        cart
            .clear()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits clearfailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                clear: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('clearfailed', spy);

        cart
            .clear()
            .error(function() {
                assert.strictEqual(spy.args[0][0], 'error');
            })
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits change event", function(done) {
        var spy = sinon.spy();

        cart.on('change', spy);

        cart
            .clear()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits changed event", function(done) {
        var spy = sinon.spy();

        cart.on('changed', spy);

        cart
            .clear()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits changefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                clear: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('changefailed', spy);

        cart
            .clear()
            .error(function() {}) // Catch the rejection from storage.put()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });
});
