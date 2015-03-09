var assert = require('chai').assert;
var value = require('../../lib/util/value');

describe("util/value()", function() {
    var val = 'foo', func = function() {
        return 'foo';
    }, funcWithContext = function() {
        return this;
    }, funcWithArgs = function(arg) {
        return arg;
    };

    it("gets value", function() {
        assert.strictEqual(value(val), 'foo');
    });

    it("gets via callback value", function() {
        assert.strictEqual(value(func), 'foo');
    });

    it("gets via callback value with context", function() {
        var context = {};
        assert.strictEqual(value(funcWithContext, context), context);
    });

    it("gets via callback value with arguments", function() {
        assert.strictEqual(value(funcWithArgs, null, ['foo']), 'foo');
    });
});
