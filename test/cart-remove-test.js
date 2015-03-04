var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().remove", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
    });

    it("removes an item", function() {
        instance.remove({id: 'Item'});

        assert.isFalse(instance.has({id: 'Item'}));
    });

    it("removes an item as string", function() {
        instance.remove('Item');

        assert.isFalse(instance.has({id: 'Item'}));
    });

    it("ignores unknown item", function() {
        instance.on('remove', function(item) {
            assert.strictEqual('Foo', item);
        });

        instance.on('removed', function(item) {
            assert.isNull(item);
        });

        instance.remove('Foo');
    });

    it("silently ignores invalid item", function(done) {
        instance.remove({});
        instance.remove({foo: 'bar'});
        instance.remove([]);
        instance.remove(null);
        instance.remove(undefined);

        done();
    });

    it("emits remove event", function(done) {
        instance.on('remove', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .remove('Item')
        ;
    });

    it("aborts if remove event listener returns false", function(done) {
        instance.on('remove', function() {
            return false;
        });

        instance
            .remove('Item')
            .ready(function() {
                assert.strictEqual(instance.size(), 1);
                done();
            })
        ;

    });

    it("emits removed event", function(done) {
        instance.on('removed', function(it) {
            assert.strictEqual(it.id(), 'Item');
            done();
        });

        instance
            .remove('Item')
        ;
    });

    it("emits removefailed event", function(done) {
        instance = cart({
            store: {
                enabled: function() { return true; },
                load: function() { return [{id: 'Item'}]; },
                remove: function() { return Promise.reject('error'); }
            }
        });

        instance.on('removefailed', function(error) {
            assert.strictEqual(error, 'error');
            done();
        });

        instance
            .remove('Item')
        ;
    });
});
