var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty()", function() {
    it("does not expose the emit method", function() {
        assert.isUndefined(carty().emit);
    });

    it("exposes item() method", function() {
        var item = carty.item('Item');

        assert.isFunction(item);
        assert.strictEqual(item.id(), 'Item');
    });

    it("exposes option() method", function() {
        assert.isObject(carty.option());
        assert.isNull(carty.option('store'));
        assert.strictEqual(carty.option('currency'), 'USD');

        carty.option('currency', 'EUR');

    });

    it("option() is immutable", function() {
        carty.option('currency', 'EUR');

        assert.strictEqual(carty.option('currency'), 'USD');
    });
});
