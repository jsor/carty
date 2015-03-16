var assert = require('chai').assert;
var sinon = require('sinon');
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().update()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("updates an item", function(done) {
        instance
            .add({id: 'Item'})
            .update({id: 'Item', price: 10})
            .ready(function() {
                assert.deepEqual(instance.get({id: 'Item'}).price(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates an item as string", function(done) {
        instance
            .add('Item')
            .update('Item')
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("does nothing if item does not exist", function(done) {
        instance
            .update({id: 'Item'})
            .ready(function() {
                assert.isFalse(instance.has({id: 'Item'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("sets quantity for existing item", function(done) {
        instance
            .add({id: 'Item'})
            .update({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("sets quantity for mixed item type", function(done) {
        instance
            .add('Item')
            .update({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates item attributes", function(done) {
        instance
            .add({id: 'Item', price: 0, foo: 'bar'})
            .update({id: 'Item', price: 5, foo: 'baz', bar: 'baz'})
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

    it("keeps custom item attributes", function(done) {
        instance
            .add({id: 'Item'})
            .add({id: 'Item', custom: 'foo'})
            .ready(function() {
                assert.strictEqual(instance.get('Item').call().custom, 'foo');
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("updates custom item attributes", function(done) {
        instance
            .add({id: 'Item', custom: 'foo'})
            .update({id: 'Item', custom: 'bar'})
            .ready(function() {
                assert.strictEqual(instance.get('Item').call().custom, 'bar');
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
            .update({id: 'Item', quantity: 0})
            .ready(function() {
                assert.strictEqual(instance.size(), 0);
                assert.isTrue(callback.called);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits update event", function(done) {
        instance.on('update', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .add('Item')
            .update('Item')
        ;
    });

    it("aborts if update event listener returns false", function(done) {
        instance.on('update', function() {
            return false;
        });

        instance
            .add('Item')
            .update({id: 'Item', quantity: 2})
            .ready(function() {
                assert.strictEqual(instance.get('Item').quantity(), 1);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("emits updated event", function(done) {
        instance.on('updated', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .add('Item')
            .update('Item')
        ;
    });

    it("emits updatefailed event", function(done) {
        instance = cart({
            storage: {
                load: function() { return []; },
                add: function() { return Promise.resolve(); },
                update: function() { return Promise.reject('error'); }
            }
        });

        instance.on('updatefailed', function(error) {
            assert.strictEqual(error, 'error')
            done();
        });

        instance
            .add('Item')
            .update('Item')
        ;
    });
});
