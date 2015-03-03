var assert = require('chai').assert;
var getOption = require('../../util/getOption');

describe("util/getOption()", function() {
    var option, options = {
        foo: 'bar',
        bar: 'baz',
        obj: {
            prop: 'value'
        }
    };

    beforeEach(function() {
        option = getOption.bind(null, options);
    });

    it("returns options", function() {
        assert.strictEqual(option('foo'), 'bar');
        assert.strictEqual(option('bar'), 'baz');

        assert.propertyVal(option('obj'), 'prop', 'value');
    });

    it("returns null for undefined option", function() {
        assert.strictEqual(option('undefined'), null);
    });

    it("returns copies for objects", function() {
        assert.notStrictEqual(option().obj, options.obj);
    });

    it("returns all options", function() {
        var opts = option();

        assert.propertyVal(opts, 'foo', 'bar');
        assert.propertyVal(opts, 'bar', 'baz');
        assert.deepPropertyVal(opts, 'obj.prop', 'value');
    });

    it("is immutable", function() {
        option('foo', 'newBar');

        assert.strictEqual(option('foo'), 'bar');
    });
});
