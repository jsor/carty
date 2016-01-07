var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().checkout()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}, {id: 'Item2'}]; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {},
                checkout: function (data) {}
            }
        });
    });

    it("emits checkout event", function(done) {
        var spy = sinon.spy();

        cart.on('checkout', spy);

        cart
            .checkout()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts if checkout event listener returns false", function(done) {
        cart.on('checkout', function() {
            return false;
        });

        cart
            .checkout()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits checkedout event", function(done) {
        var spy = sinon.spy();

        cart.on('checkedout', spy);

        cart
            .checkout()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits checkoutfailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                checkout: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('checkoutfailed', spy);

        cart
            .checkout()
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
            .checkout()
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
            .checkout()
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
                checkout: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('changefailed', spy);

        cart
            .checkout()
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
