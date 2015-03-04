var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().add", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("adds an item", function(done) {
        instance
            .add({id: 'Item'})
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
                done();
            })
        ;
    });

    it("adds an item as string", function(done) {
        instance
            .add('Item')
            .ready(function() {
                assert.isTrue(instance.has({id: 'Item'}));
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
                done();
            })
        ;
    });

    it("updates existing item attributes", function(done) {
        instance
            .add({id: 'Item', tax: 0})
            .add({id: 'Item', tax: .5, shipping: 10})
            .ready(function() {
                assert.strictEqual(instance.get('Item').tax(), .5);
                assert.strictEqual(instance.get('Item').shipping(), 10);
                done();
            })
        ;
    });

    it("keeps custom item attributes", function(done) {
        instance
            .add({id: 'Item', custom: 'foo'})
            .ready(function() {
                assert.strictEqual(instance.get('Item').call().custom, 'foo');
                done();
            })
        ;
    });

    it("updates custom item attributes", function(done) {
        instance
            .add({id: 'Item', custom: 'foo'})
            .add({id: 'Item', custom: 'bar'})
            .ready(function() {
                assert.strictEqual(instance.get('Item').call().custom, 'bar');
                done();
            })
        ;
    });

    it("removes item if quantity lower 0", function(done) {
        instance
            .add({id: 'Item'})
            .ready(function() {
                assert.strictEqual(1, instance.size());
            })
            .add({id: 'Item', quantity: -1})
            .ready(function() {
                assert.strictEqual(instance.size(), 0);
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
});
