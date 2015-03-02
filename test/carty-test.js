var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty()", function() {
    it("does not expose the emit method", function() {
        assert.isUndefined(carty().emit);
    });
});
