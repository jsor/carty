var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty().each", function() {
    var instance;

    beforeEach(function() {
        instance = carty();
        instance.add({id: 'Item'});
        instance.add({id: 'Item2'});
    });

    it("iterates over all items", function() {
        var count = 0;
        instance.each(function() {
            count++;
        });

        assert.strictEqual(count, 2);
    });

    it("aborts iteration if callback returns false", function() {
        var count = 0;
        instance.each(function() {
            count++;
            return false;
        });

        assert.strictEqual(count, 1);
    });
});
