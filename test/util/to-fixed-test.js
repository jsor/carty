var expect = require('chai').expect;
var toFixed = require('../../lib/util/to-fixed');

describe("util/toFixed()", function() {
    it('converts numbers', function() {
        expect(toFixed(123.456)).to.equal('123');
        expect(toFixed(123.456, 2)).to.equal('123.46');
        expect(toFixed(123.456, 3)).to.equal('123.456');
        expect(toFixed(123.456, 4)).to.equal('123.4560');

        expect(toFixed(123)).to.equal('123');
        expect(toFixed(123, 2)).to.equal('123.00');
        expect(toFixed(123, 3)).to.equal('123.000');
        expect(toFixed(123, 4)).to.equal('123.0000');
    });

    it('can be configured', function() {
        var fix = toFixed.configure({roundingFunction: function(value) { return value / 10; }});

        expect(fix(123.456, 3)).to.equal('12.346');
    });
});
