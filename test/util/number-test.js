var expect = require('chai').expect;
var number = require('../../lib/util/number');

// Adapted from component-emitter
describe("util/number()", function() {
    it('parses strings', function() {
        expect(number('$ 123,456')).to.equal(123456);
        expect(number('$ 123,456.78')).to.equal(123456.78);
        expect(number('&*()$ 123,456')).to.equal(123456);
        expect(number(';$@#$%^&123,456.78')).to.equal(123456.78);

        // comma decimal
        expect(number('$ 123,456', ',')).to.equal(123.456);
        expect(number('$ 123.456,78', ',')).to.equal(123456.78);
        expect(number('&*()$ 123,456', ',')).to.equal(123.456);
        expect(number(';$@#$%^&123.456,78', ',')).to.equal(123456.78);

        // comma decimal (detection)
        expect(number('$ 123,456.78')).to.equal(123456.78);
        expect(number('&*()$ 123,456.78')).to.equal(123456.78);
        expect(number(';$@#$%^&123,456.78')).to.equal(123456.78);

        expect(number('$ 123.456,78')).to.equal(123456.78);
        expect(number('&*()$ 123.456,78')).to.equal(123456.78);
        expect(number(';$@#$%^&123.456,78')).to.equal(123456.78);
    });

    it('parses negatives strings', function() {
        expect(number('$ -123,456')).to.equal(-123456);
        expect(number('$ -123,456.78')).to.equal(-123456.78);
        expect(number('&*()$ -123,456')).to.equal(-123456);
        expect(number(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        // comma decimal
        expect(number('$ -123,456', ',')).to.equal(-123.456);
        expect(number('$ -123.456,78', ',')).to.equal(-123456.78);
        expect(number('&*()$ -123,456', ',')).to.equal(-123.456);
        expect(number(';$@#$%^&-123.456,78', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(number('$ -123,456.78')).to.equal(-123456.78);
        expect(number('&*()$ -123,456.78')).to.equal(-123456.78);
        expect(number(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        expect(number('$ -123.456,78')).to.equal(-123456.78);
        expect(number('&*()$ -123.456,78')).to.equal(-123456.78);
        expect(number(';$@#$%^&-123.456,78')).to.equal(-123456.78);
    });

    it('parses bracketed negatives strings', function() {
        expect(number('$ (123,456)')).to.equal(-123456);
        expect(number('$ (123,456.78)')).to.equal(-123456.78);
        expect(number('&*()$ (-123,456)')).to.equal(-123456);
        expect(number(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(number('$ (123,456)', ',')).to.equal(-123.456);
        expect(number('$ (123.456,78)', ',')).to.equal(-123456.78);
        expect(number('&*()$ (123,456)', ',')).to.equal(-123.456);
        expect(number(';$@#$%^&(123.456,78)', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(number('$ (123,456.78)')).to.equal(-123456.78);
        expect(number('&*()$ (123,456.78)')).to.equal(-123456.78);
        expect(number(';$@#$%^&(123,456.78)')).to.equal(-123456.78);

        expect(number('$ (123.456,78)')).to.equal(-123456.78);
        expect(number('&*()$ (123.456,78)')).to.equal(-123456.78);
        expect(number(';$@#$%^&(123.456,78)')).to.equal(-123456.78);
    });

    it('parses bracketed negatives with minus strings', function() {
        expect(number('$ (-123,456)')).to.equal(-123456);
        expect(number('$ (-123,456.78)')).to.equal(-123456.78);
        expect(number('&*()$ (-123,456)')).to.equal(-123456);
        expect(number(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(number('$ (-123,456)', ',')).to.equal(-123.456);
        expect(number('$ (-123.456,78)', ',')).to.equal(-123456.78);
        expect(number('&*()$ (-123,456)', ',')).to.equal(-123.456);
        expect(number(';$@#$%^&(-123.456,78)', ',')).to.equal(-123456.78);

        // comma decimal (detection)
        expect(number('$ (-123,456.78)')).to.equal(-123456.78);
        expect(number('&*()$ (-123,456.78)')).to.equal(-123456.78);
        expect(number(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        expect(number('$ (-123.456,78)')).to.equal(-123456.78);
        expect(number('&*()$ (-123.456,78)')).to.equal(-123456.78);
        expect(number(';$@#$%^&(-123.456,78)')).to.equal(-123456.78);
    });

    it('parses non-strings', function() {
        expect(number(123.456)).to.equal(123.456);
        expect(number(123456)).to.equal(123456);
        expect(number(new Number(123.456))).to.equal(123.456);
        expect(number(new Number(123456))).to.equal(123456);
    });

    it('parses with different decimals', function() {
        expect(number('$ 123%456', '%')).to.equal(123.456);
        expect(number('$ 123.456|78', '|')).to.equal(123456.78);
        expect(number('&*()$ 123>456', '>')).to.equal(123.456);
        expect(number(';$@#$%^&123,456\'78', '\'')).to.equal(123456.78);
    });
});
