var expect = require('chai').expect;
var toFloat = require('../../util/toFloat');

// Adapted from component-emitter
describe("util/toFloat()", function() {
    it('parses strings', function() {
        expect(toFloat('$ 123,456')).to.equal(123456);
        expect(toFloat('$ 123,456.78')).to.equal(123456.78);
        expect(toFloat('&*()$ 123,456')).to.equal(123456);
        expect(toFloat(';$@#$%^&123,456.78')).to.equal(123456.78);

        // comma decimal
        expect(toFloat('$ 123,456', ',')).to.equal(123.456);
        expect(toFloat('$ 123.456,78', ',')).to.equal(123456.78);
        expect(toFloat('&*()$ 123,456', ',')).to.equal(123.456);
        expect(toFloat(';$@#$%^&123.456,78', ',')).to.equal(123456.78);

        // comma decimal (detection)
        expect(toFloat('$ 123,456.78')).to.equal(123456.78);
        expect(toFloat('&*()$ 123,456.78')).to.equal(123456.78);
        expect(toFloat(';$@#$%^&123,456.78')).to.equal(123456.78);

        expect(toFloat('$ 123.456,78')).to.equal(123456.78);
        expect(toFloat('&*()$ 123.456,78')).to.equal(123456.78);
        expect(toFloat(';$@#$%^&123.456,78')).to.equal(123456.78);
    });

    it('parses negatives strings', function() {
        expect(toFloat('$ -123,456')).to.equal(-123456);
        expect(toFloat('$ -123,456.78')).to.equal(-123456.78);
        expect(toFloat('&*()$ -123,456')).to.equal(-123456);
        expect(toFloat(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        // comma decimal
        expect(toFloat('$ -123,456', ',')).to.equal(-123.456);
        expect(toFloat('$ -123.456,78', ',')).to.equal(-123456.78);
        expect(toFloat('&*()$ -123,456', ',')).to.equal(-123.456);
        expect(toFloat(';$@#$%^&-123.456,78', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toFloat('$ -123,456.78')).to.equal(-123456.78);
        expect(toFloat('&*()$ -123,456.78')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        expect(toFloat('$ -123.456,78')).to.equal(-123456.78);
        expect(toFloat('&*()$ -123.456,78')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&-123.456,78')).to.equal(-123456.78);
    });

    it('parses bracketed negatives strings', function() {
        expect(toFloat('$ (123,456)')).to.equal(-123456);
        expect(toFloat('$ (123,456.78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (-123,456)')).to.equal(-123456);
        expect(toFloat(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(toFloat('$ (123,456)', ',')).to.equal(-123.456);
        expect(toFloat('$ (123.456,78)', ',')).to.equal(-123456.78);
        expect(toFloat('&*()$ (123,456)', ',')).to.equal(-123.456);
        expect(toFloat(';$@#$%^&(123.456,78)', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toFloat('$ (123,456.78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (123,456.78)')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&(123,456.78)')).to.equal(-123456.78);

        expect(toFloat('$ (123.456,78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (123.456,78)')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&(123.456,78)')).to.equal(-123456.78);
    });

    it('parses bracketed negatives with minus strings', function() {
        expect(toFloat('$ (-123,456)')).to.equal(-123456);
        expect(toFloat('$ (-123,456.78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (-123,456)')).to.equal(-123456);
        expect(toFloat(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(toFloat('$ (-123,456)', ',')).to.equal(-123.456);
        expect(toFloat('$ (-123.456,78)', ',')).to.equal(-123456.78);
        expect(toFloat('&*()$ (-123,456)', ',')).to.equal(-123.456);
        expect(toFloat(';$@#$%^&(-123.456,78)', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toFloat('$ (-123,456.78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (-123,456.78)')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        expect(toFloat('$ (-123.456,78)')).to.equal(-123456.78);
        expect(toFloat('&*()$ (-123.456,78)')).to.equal(-123456.78);
        expect(toFloat(';$@#$%^&(-123.456,78)')).to.equal(-123456.78);
    });

    it('parses non-strings', function() {
        expect(toFloat(123.456)).to.equal(123.456);
        expect(toFloat(123456)).to.equal(123456);
        expect(toFloat(new Number(123.456))).to.equal(123.456);
        expect(toFloat(new Number(123456))).to.equal(123456);
    });

    it('parses with different decimals', function() {
        expect(toFloat('$ 123%456', '%')).to.equal(123.456);
        expect(toFloat('$ 123.456|78', '|')).to.equal(123456.78);
        expect(toFloat('&*()$ 123>456', '>')).to.equal(123.456);
        expect(toFloat(';$@#$%^&123,456\'78', '\'')).to.equal(123456.78);
    });
});
