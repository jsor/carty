var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("cart().remove()", function() {
    var cart;

    beforeEach(function() {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}]; },
                add: function (item, items) { },
                update: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });
    });

    it("removes an item", function() {
        cart.remove({id: 'Item'});

        assert.isFalse(cart.has({id: 'Item'}));
    });

    it("removes an item as string", function() {
        cart.remove('Item');

        assert.isFalse(cart.has({id: 'Item'}));
    });

    it("ignores unknown item", function() {
        cart.on('remove', function(item) {
            assert.strictEqual('Foo', item);
        });

        cart.on('removed', function(item) {
            assert.isNull(item);
        });

        cart.remove('Foo');
    });

    it("silently ignores invalid item", function(done) {
        cart.remove({});
        cart.remove({foo: 'bar'});
        cart.remove([]);
        cart.remove(null);
        cart.remove(undefined);

        cart.ready(function() {
            done();
        });
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
            .ready(function() {
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
                load: function() { return [{id: 'Item'}]; },
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
        cart.on('change', function() {
            done();
        });

        cart
            .remove('Item')
        ;
    });

    it("emits changed event", function(done) {
        cart.on('changed', function() {
            done();
        });

        cart
            .remove('Item')
        ;
    });

    it("emits changefailed event", function(done) {
        cart = carty({
            storage: {
                load: function() { return [{id: 'Item'}]; },
                remove: function() { return Promise.reject('error'); }
            }
        });

        cart.on('changefailed', function() {
            done();
        });

        cart
            .remove('Item')
        ;
    });
});
