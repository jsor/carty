var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().add()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
    });

    it("adds an item", function(done) {
        cart
            .add({id: 'Item'})
            .ready(function(cart) {
                assert.isTrue(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("adds an item as string", function(done) {
        cart
            .add('Item')
            .ready(function() {
                assert.isTrue(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for existing item", function(done) {
        cart
            .add({id: 'Item'})
            .add({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(cart.get('Item').quantity, 3);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for existing item added as string", function(done) {
        cart
            .add('Item')
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.get('Item').quantity, 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for mixed item type", function(done) {
        cart
            .add('Item')
            .add({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(cart.get('Item').quantity, 3);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates item attributes", function(done) {
        cart
            .add({id: 'Item', price: 0, foo: 'bar'})
            .add({id: 'Item', price: 5, foo: 'baz', bar: 'baz'})
            .ready(function() {
                assert.strictEqual(cart.get('Item').price, 5);
                assert.strictEqual(cart.get('Item').foo, 'baz');
                assert.strictEqual(cart.get('Item').bar, 'baz');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes existing item if quantity lower 0", function(done) {
        cart
            .add({id: 'Item'})
            .ready(function() {
                assert.strictEqual(cart.size(), 1);
            })
            .add({id: 'Item', quantity: -1})
            .ready(function() {
                assert.strictEqual(cart.size(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("does nothing if item quantity lower 0", function(done) {
        cart
            .add({id: 'Nonexisting Item', quantity: -1})
            .ready(function() {
                assert.strictEqual(cart.size(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits add event", function(done) {
        var spy = sinon.spy();

        cart.on('add', spy);

        cart
            .add('Item')
            .ready(function() {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.args[0][0], 'Item');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts if add event listener returns false", function(done) {
        cart.on('add', function() {
            return false;
        });

        cart
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.size(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits added event", function(done) {
        var spy = sinon.spy();

        cart.on('added', spy);

        cart
            .add('Item')
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

    it("emits addfailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                add: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('addfailed', spy);

        cart
            .add('Item')
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
        cart.on('change', function() {
            done();
        });

        cart
            .add('Item')
        ;
    });

    it("emits changed event", function(done) {
        cart.on('changed', function(it) {
            done();
        });

        cart
            .add('Item')
        ;
    });

    it("emits changefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return []; },
                add: function() { return Promise.reject('error'); }
            }
        });

        cart.on('changefailed', function(error) {
            done();
        });

        cart
            .add('Item')
        ;
    });
});
