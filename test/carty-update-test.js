var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().update()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}]; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("updates an item", function(done) {
        cart
            .update({id: 'Item', price: 10})
            .ready(function(cart) {
                assert.deepEqual(cart.get({id: 'Item'}).price, 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates an item as string", function(done) {
        cart
            .update('Item')
            .ready(function(cart) {
                assert.isTrue(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates an item as item()", function(done) {
        cart
            .update(cart.item({id: 'Item', price: 10}))
            .ready(function(cart) {
                assert.deepEqual(cart.get({id: 'Item'}).price, 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("does nothing if item does not exist", function(done) {
        carty()
            .update({id: 'Item2'})
            .ready(function(cart) {
                assert.isFalse(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("sets quantity for existing item", function(done) {
        cart
            .update({id: 'Item', quantity: 2})
            .ready(function(cart) {
                assert.strictEqual(cart.get('Item').quantity, 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("sets quantity for mixed item type", function(done) {
        cart
            .update({id: 'Item', quantity: 2})
            .ready(function(cart) {
                assert.strictEqual(cart.get('Item').quantity, 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates item attributes", function(done) {
        cart
            .update({id: 'Item', price: 5, foo: 'bar', bar: 'baz'})
            .ready(function(cart) {
                assert.strictEqual(cart.get('Item').price, 5);
                assert.strictEqual(cart.get('Item').foo, 'bar');
                assert.strictEqual(cart.get('Item').bar, 'baz');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates custom item attributes", function(done) {
        cart
            .update({id: 'Item', custom: 'foo'})
            .update({id: 'Item', custom: 'bar'})
            .ready(function(cart) {
                assert.strictEqual(cart.get('Item').custom, 'bar');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes existing item if quantity lower 0", function(done) {
        cart
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 1);
            })
            .update({id: 'Item', quantity: 0})
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits update event", function(done) {
        var spy = sinon.spy();

        cart.on('update', spy);

        cart
            .update('Item')
            .ready(function() {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.args[0][0], 'Item');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts if update event listener returns false", function(done) {
        cart.on('update', function() {
            return false;
        });

        cart
            .update({id: 'Item', quantity: 2})
            .ready(function(cart) {
                assert.strictEqual(cart.get('Item').quantity, 1);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits updated event", function(done) {
        var spy = sinon.spy();

        cart.on('updated', spy);

        cart
            .update('Item')
            .ready(function() {
                assert.isTrue(spy.called);
                assert.deepEqual(spy.args[0][0], {
                    id: 'Item',
                    label: "Item",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits updatefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}]; },
                put: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('updatefailed', spy);

        cart
            .update('Item')
            .error(function() {
                assert.strictEqual(spy.args[0][0], 'error');
                assert.deepEqual(spy.args[0][1], {
                    id: 'Item',
                    label: "Item",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
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
            .update('Item')
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
            .update('Item')
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
                load: function() { return [{id: 'Item'}]; },
                put: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('changefailed', spy);

        cart
            .update('Item')
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
