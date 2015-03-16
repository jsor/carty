var assert = require('chai').assert;
var sinon = require('sinon');
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().add()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("adds an item", function(done) {
        instance
            .add({id: 'Item'})
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("adds an item as string", function(done) {
        instance
            .add('Item')
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for existing item", function(done) {
        instance
            .add({id: 'Item'})
            .add({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 3);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for existing item added as string", function(done) {
        instance
            .add('Item')
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates quantity for mixed item type", function(done) {
        instance
            .add('Item')
            .add({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 3);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates item attributes", function(done) {
        instance
            .add({id: 'Item', price: 0, foo: 'bar'})
            .add({id: 'Item', price: 5, foo: 'baz', bar: 'baz'})
            .ready(function() {
                assert.strictEqual(instance.get('Item').price(), 5);
                assert.strictEqual(instance.get('Item').call().foo, 'baz');
                assert.strictEqual(instance.get('Item').call().bar, 'baz');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes existing item if quantity lower 0", function(done) {
        var callback = sinon.spy();

        instance.on('add', callback);

        instance
            .add({id: 'Item'})
            .ready(function() {
                assert.strictEqual(instance.size(), 1);
            })
            .add({id: 'Item', quantity: -1})
            .ready(function() {
                assert.strictEqual(instance.size(), 0);
                assert.isTrue(callback.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("does nothing if item quantity lower 0", function(done) {
        var callback = sinon.spy();

        instance.on('remove', callback);

        instance
            .add({id: 'Nonexisting Item', quantity: -1})
            .ready(function() {
                assert.strictEqual(instance.size(), 0);
                assert.isFalse(callback.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits add event", function(done) {
        instance.on('add', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .add('Item')
        ;
    });

    it("aborts if add event listener returns false", function(done) {
        instance.on('add', function() {
            return false;
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.size(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits added event", function(done) {
        instance.on('added', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .add('Item')
        ;
    });

    it("emits addfailed event", function(done) {
        instance = cart({
            storage: {
                load: function() { return []; },
                add: function() { return Promise.reject('error'); }
            }
        });

        instance.on('addfailed', function(error) {
            assert.strictEqual(error, 'error')
            done();
        });

        instance
            .add('Item')
        ;
    });
});
