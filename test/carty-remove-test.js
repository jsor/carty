var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty().remove", function() {
    var instance;

    beforeEach(function() {
        instance = carty();
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

    it("silently ignores invalid item", function() {
        instance.on('remove', function(item) {
            assert.strictEqual('Foo', item);
        });

        instance.on('removed', function(item) {
            assert.isNull(item);
        });

        instance.remove('Foo');
    });

    it("emits remove event", function() {
        instance.on('remove', function(it) {
            assert.strictEqual('Item', it);
        });

        instance.remove('Item');
    });

    it("aborts if remove event listener returns false", function() {
        instance.on('remove', function() {
            return false;
        });

        instance.remove('Item');

        assert.strictEqual(1, instance.size());
    });

    it("emits removed event", function() {
        instance.on('removed', function(it) {
            assert.strictEqual('Item', it.id());
        });

        instance.remove('Item');
    });
});
