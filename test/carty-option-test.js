var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty().has", function() {
    var instance, options = {
        foo: 'bar',
        bar: 'baz',
        obj: {
            prop: 'value'
        }
    };

    beforeEach(function() {
        instance = carty(options);
    });

    it("returns options", function() {
        assert.strictEqual('bar', instance.option('foo'));
        assert.strictEqual('baz', instance.option('bar'));

        assert.propertyVal(instance.option('obj'), 'prop', 'value');
    });

    it("returns null for undefined option", function() {
        assert.strictEqual(null, instance.option('undefined'));
    });

    it("returns copies for objects", function() {
        assert.notStrictEqual({
            prop: 'value'
        }, instance.option('obj'));
    });

    it("returns all options", function() {
        var opts = instance.option();

        assert.propertyVal(opts, 'foo', 'bar');
        assert.propertyVal(opts, 'bar', 'baz');
        assert.deepPropertyVal(opts, 'obj.prop', 'value');
    });
});
