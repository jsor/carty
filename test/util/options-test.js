var assert = require('chai').assert;
var options = require('../../lib/util/options');

describe("util/options()", function() {
    var opt, opts = {
        foo: 'bar',
        bar: 'baz',
        obj: {
            prop: 'value'
        }
    };

    beforeEach(function() {
        opt = options.bind(null, opts);
    });

    it("returns options", function() {
        assert.strictEqual(opt('foo'), 'bar');
        assert.strictEqual(opt('bar'), 'baz');

        assert.propertyVal(opt('obj'), 'prop', 'value');
    });

    it("returns null for undefined option", function() {
        assert.strictEqual(opt('undefined'), null);
    });

    it("returns copies for objects", function() {
        assert.notStrictEqual(opt().obj, opts.obj);
    });

    it("returns all options", function() {
        var opts = opt();

        assert.propertyVal(opts, 'foo', 'bar');
        assert.propertyVal(opts, 'bar', 'baz');
        assert.deepPropertyVal(opts, 'obj.prop', 'value');
    });

    it("sets option", function() {
        opt('foo', 'newBar');

        assert.strictEqual(opt('foo'), 'newBar');
    });

    it("sets multiple options", function() {
        opt({foo: 'newBar'});

        assert.strictEqual(opt('foo'), 'newBar');
    });
});
