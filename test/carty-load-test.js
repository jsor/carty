var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().load()", function() {
    var cart, storedItems;

    beforeEach(function() {
        storedItems = [{id: 'Item'}, {id: 'Item2'}];
        cart = carty({
            storage: {
                load: function() { return {items: storedItems }; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("loads all items", function(done) {
        cart
            .ready(function() {
                storedItems = [{id: 'Item'}, {id: 'Item2'}, {id: 'Item3'}];
            })
            .load()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 3);

                var count = 0;
                cart.each(function() {
                    count++;
                });

                assert.strictEqual(count, 3);

                assert.strictEqual(cart().items.length, 3);

                done();
            })
        ;
    });

    it("ignores undefined data", function(done) {
        cart = carty({
            storage: {
                load: function() { },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });

        cart
            .load()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 0);
                done();
            })
        ;
    });

    it("ignores undefined items", function(done) {
        cart = carty({
            storage: {
                load: function() { return {items: undefined }; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });

        cart
            .load()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 0);
                done();
            })
        ;
    });

    it("loads only once if called before initial ready call", function(done) {
        var spy = sinon.spy();

        cart.on('load', spy);

        cart
            .load()
            .ready(function() {
                assert.strictEqual(1, spy.callCount);
                done();
            })
        ;
    });

    it("emits load event", function(done) {
        var spy = sinon.spy();

        cart.on('load', spy);

        cart
            .load()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("aborts if load event listener returns false", function(done) {
        cart.on('load', function() {
            return false;
        });

        cart
            .load()
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 0);
                done();
            })
        ;
    });

    it("emits loaded event", function(done) {
        var spy = sinon.spy();

        cart.on('loaded', spy);

        cart
            .load()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("emits loadfailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('loadfailed', spy);

        cart
            .load()
            .error(function() {
                assert.strictEqual(spy.args[0][0], 'error');
            })
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("emits change event", function(done) {
        var spy = sinon.spy();

        cart.on('change', spy);

        cart
            .load()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("emits changed event", function(done) {
        var spy = sinon.spy();

        cart.on('changed', spy);

        cart
            .load()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("emits changefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('changefailed', spy);

        cart
            .load()
            .error(function() {}) // Catch the rejection from storage.load()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });
});
