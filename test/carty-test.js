var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');
var cartyMemoryStore = typeof window !== 'undefined' ? window.cartyMemoryStore : require('../lib/store/memory');

describe("carty()", function() {
    it("does not expose the emit method", function() {
        assert.isUndefined(carty().emit);
    });

    it("saves items to store", function() {
        var store = cartyMemoryStore();
        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        assert.strictEqual(store.get().length, 2);
    });

    it("loads items from store", function() {
        var store = cartyMemoryStore();
        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        var newInstance = carty({store: store});
        assert.strictEqual(newInstance.size(), 2);
    });

    it("clears store", function() {
        var store = cartyMemoryStore();
        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        assert.strictEqual(store.get().length, 2);

        instance.clear();

        assert.strictEqual(store.get().length, 0);
    });
});
