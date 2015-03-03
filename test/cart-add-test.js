var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().add", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("adds an item", function() {
        instance.add({id: 'Item'});

        assert(instance.has({id: 'Item'}));
    });

    it("adds an item as string", function() {
        instance.add('Item');

        assert(instance.has({id: 'Item'}));
    });

    it("updates quantity for existing item", function() {
        instance.add({id: 'Item'});
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(instance.get('Item').quantity(), 3);
    });

    it("updates quantity for existing item added as string", function() {
        instance.add('Item');
        instance.add('Item');

        assert.strictEqual(instance.get('Item').quantity(), 2);
    });

    it("updates quantity for mixed item type", function() {
        instance.add('Item');
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(instance.get('Item').quantity(), 3);
    });

    it("updates existing item attributes", function() {
        instance.add({id: 'Item', tax: 0});
        instance.add({id: 'Item', tax: .5, shipping: 10});

        assert.strictEqual(instance.get('Item').tax(), .5);
        assert.strictEqual(instance.get('Item').shipping(), 10);
    });

    it("keeps custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});

        assert.strictEqual(instance.get('Item').call().custom, 'foo');
    });

    it("updates custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});
        instance.add({id: 'Item', custom: 'bar'});

        assert.strictEqual(instance.get('Item').call().custom, 'bar');
    });

    it("removes item if quantity lower 0", function() {
        instance.add({id: 'Item'});

        assert.strictEqual(1, instance.size());

        instance.add({id: 'Item', quantity: -1});

        assert.strictEqual(0, instance.size());
    });

    it("emits add event", function() {
        instance.on('add', function(it) {
            assert.strictEqual(it.id(), 'Item');
        });

        instance.add('Item');
    });

    it("aborts if add event listener returns false", function() {
        instance.on('add', function() {
            return false;
        });

        instance.add('Item');

        assert.strictEqual(instance.size(), 0);
    });

    it("emits added event", function() {
        instance.on('added', function(it) {
            assert.strictEqual(it.id(), 'Item');
        });

        instance.add('Item');
    });
});
