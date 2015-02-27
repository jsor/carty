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

        assert.strictEqual(2, store.get().length);
    });

    it("loads items from store", function() {
        var store = cartyMemoryStore();
        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        var newInstance = carty({store: store});
        assert.strictEqual(2, newInstance.size());
    });

    it("clears store", function() {
        var store = cartyMemoryStore();
        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        assert.strictEqual(2, store.get().length);

        instance.clear();

        assert.strictEqual(0, store.get().length);
    });
});
