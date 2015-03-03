var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().clear", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
        instance.add({id: 'Item2'});
    });

    it("removes all items", function() {
        instance.clear();

        assert.strictEqual(instance.size(), 0);

        var count = 0;
        instance.each(function() {
            count++;
        });

        assert.strictEqual(count, 0);

        assert.strictEqual(instance().length, 0);
    });

    it("emits clear event", function() {
        instance.on('clear', function() {
            assert(true);
        });

        instance.clear();
    });

    it("aborts if clear event listener returns false", function() {
        instance.on('clear', function() {
            return false;
        });

        instance.clear();

        assert.strictEqual(instance.size(), 2);
    });

    it("emits cleared event", function() {
        instance.on('cleared', function() {
            assert(true);
        });

        instance.clear();
    });
});
