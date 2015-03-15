var expect = require('chai').expect;
var parseNumber = require('../../lib/util/parse-number');

describe("util/parseNumber()", function() {
    it('parses strings', function() {
        expect(parseNumber('$ 123,456')).to.equal(123456);
        expect(parseNumber('$ 123,456.78')).to.equal(123456.78);
        expect(parseNumber('&*()$ 123,456')).to.equal(123456);
        expect(parseNumber(';$@#$%^&123,456.78')).to.equal(123456.78);

        // comma decimal
        expect(parseNumber('$ 123,456', {decimalSeparator: ','})).to.equal(123.456);
        expect(parseNumber('$ 123.456,78', {decimalSeparator: ','})).to.equal(123456.78);
        expect(parseNumber('&*()$ 123,456', {decimalSeparator: ','})).to.equal(123.456);
        expect(parseNumber(';$@#$%^&123.456,78', {decimalSeparator: ','})).to.equal(123456.78);

        // comma decimal (detection)
        expect(parseNumber('$ 123,456.78')).to.equal(123456.78);
        expect(parseNumber('&*()$ 123,456.78')).to.equal(123456.78);
        expect(parseNumber(';$@#$%^&123,456.78')).to.equal(123456.78);

        expect(parseNumber('$ 123.456,78')).to.equal(123456.78);
        expect(parseNumber('&*()$ 123.456,78')).to.equal(123456.78);
        expect(parseNumber(';$@#$%^&123.456,78')).to.equal(123456.78);
    });

    it('parses negatives strings', function() {
        expect(parseNumber('$ -123,456')).to.equal(-123456);
        expect(parseNumber('$ -123,456.78')).to.equal(-123456.78);
        expect(parseNumber('&*()$ -123,456')).to.equal(-123456);
        expect(parseNumber(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        // comma decimal
        expect(parseNumber('$ -123,456', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber('$ -123.456,78', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(parseNumber('&*()$ -123,456', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber(';$@#$%^&-123.456,78', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(parseNumber('$ -123,456.78')).to.equal(-123456.78);
        expect(parseNumber('&*()$ -123,456.78')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        expect(parseNumber('$ -123.456,78')).to.equal(-123456.78);
        expect(parseNumber('&*()$ -123.456,78')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&-123.456,78')).to.equal(-123456.78);
    });

    it('parses bracketed negatives strings', function() {
        expect(parseNumber('$ (123,456)')).to.equal(-123456);
        expect(parseNumber('$ (123,456.78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (-123,456)')).to.equal(-123456);
        expect(parseNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(parseNumber('$ (123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber('$ (123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(parseNumber('&*()$ (123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber(';$@#$%^&(123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(parseNumber('$ (123,456.78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (123,456.78)')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&(123,456.78)')).to.equal(-123456.78);

        expect(parseNumber('$ (123.456,78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (123.456,78)')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&(123.456,78)')).to.equal(-123456.78);
    });

    it('parses bracketed negatives with minus strings', function() {
        expect(parseNumber('$ (-123,456)')).to.equal(-123456);
        expect(parseNumber('$ (-123,456.78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (-123,456)')).to.equal(-123456);
        expect(parseNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(parseNumber('$ (-123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber('$ (-123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(parseNumber('&*()$ (-123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(parseNumber(';$@#$%^&(-123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(parseNumber('$ (-123,456.78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (-123,456.78)')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        expect(parseNumber('$ (-123.456,78)')).to.equal(-123456.78);
        expect(parseNumber('&*()$ (-123.456,78)')).to.equal(-123456.78);
        expect(parseNumber(';$@#$%^&(-123.456,78)')).to.equal(-123456.78);
    });

    it('parses non-strings', function() {
        expect(parseNumber(123.456)).to.equal(123.456);
        expect(parseNumber(123456)).to.equal(123456);
        expect(parseNumber(new Number(123.456))).to.equal(123.456);
        expect(parseNumber(new Number(123456))).to.equal(123456);

        expect(parseNumber(undefined)).to.equal(0);
        expect(parseNumber(null)).to.equal(0);
        expect(parseNumber([])).to.equal(0);
        expect(parseNumber({})).to.equal(0);
    });

    it('parses with different decimals', function() {
        expect(parseNumber('$ 123%456', {decimalSeparator: '%'})).to.equal(123.456);
        expect(parseNumber('$ 123.456|78', {decimalSeparator: '|'})).to.equal(123456.78);
        expect(parseNumber('&*()$ 123>456', {decimalSeparator: '>'})).to.equal(123.456);
        expect(parseNumber(';$@#$%^&123,456\'78', {decimalSeparator: '\''})).to.equal(123456.78);
    });

    it('can be configured', function() {
        var parse = parseNumber.configure({decimalSeparator: '%'});

        expect(parse('$ 123%456')).to.equal(123.456);
    });
});
