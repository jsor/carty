var assert = require('chai').assert;
var getValue = require('../../util/getValue');

describe("util/getValue()", function() {
    var value = 'foo', func = function() {
        return 'foo';
    }, funcWithContext = function() {
        return this;
    }, funcWithArgs = function(arg) {
        return arg;
    };

    it("gets value", function() {
        assert.strictEqual(getValue(value), 'foo');
    });

    it("gets via callback value", function() {
        assert.strictEqual(getValue(func), 'foo');
    });

    it("gets via callback value with context", function() {
        var context = {};
        assert.strictEqual(getValue(funcWithContext, context), context);
    });

    it("gets via callback value with arguments", function() {
        assert.strictEqual(getValue(funcWithArgs, null, ['foo']), 'foo');
    });
});
