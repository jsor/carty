var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().remove()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return {items: [{id: 'Item'}] }; },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("removes an item", function(done) {
        cart
            .remove({id: 'Item'})
            .ready(function(cart) {
                assert.isFalse(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes an item as string", function(done) {
        cart
            .remove('Item')
            .ready(function(cart) {
                assert.isFalse(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes an item as item()", function(done) {
        cart
            .remove(cart.item('Item'))
            .ready(function(cart) {
                assert.isFalse(cart.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("ignores unknown item", function(done) {
        var spy = sinon.spy();

        cart.on('remove', spy);
        cart.on('removed', spy);

        cart
            .remove('Foo')
            .ready(function() {
                assert.strictEqual(1, spy.callCount);
                assert.isTrue(spy.calledWith('Foo'));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("silently ignores invalid item", function(done) {
        cart
            .remove({})
            .remove({foo: 'bar'})
            .remove([])
            .remove(null)
            .remove(undefined)
            .ready(function() {
                done();
            })
        ;
    });

    it("emits remove event", function(done) {
        var spy = sinon.spy();

        cart.on('remove', spy);

        cart
            .remove('Item')
            .ready(function() {
                assert.isTrue(spy.called);
                assert.strictEqual(spy.args[0][0], 'Item');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("aborts if remove event listener returns false", function(done) {
        cart.on('remove', function() {
            return false;
        });

        cart
            .remove('Item')
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 1);
            })
            .ready(function() {
                done();
            })
        ;

    });

    it("emits removed event", function(done) {
        var spy = sinon.spy();

        cart.on('removed', spy);

        cart
            .remove('Item')
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

    it("emits removefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return {items: [{id: 'Item'}] }; },
                remove: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('removefailed', spy);

        cart
            .remove('Item')
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
            .remove('Item')
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
            .remove('Item')
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
                load: function() { return {items: [{id: 'Item'}] }; },
                remove: function() { return Promise.reject('error'); }
            }
        });

        var spy = sinon.spy();

        cart.on('changefailed', spy);

        cart
            .remove('Item')
            .error(function() {}) // Catch the rejection from storage.remove()
            .ready(function() {
                assert.isTrue(spy.called);
            })
            .ready(function() {
                done();
            })
        ;
    });
});
