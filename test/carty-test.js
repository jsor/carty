var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty()", function() {
    it("does not expose the emit method", function() {
        assert.isUndefined(carty().emit);
    });

    it("exposes item method", function() {
        var item = carty.item('Item');

        assert.isFunction(item);
        assert.strictEqual(item.id(), 'Item');
    });
});
