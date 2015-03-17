var expect = require('chai').expect;
var toNumber = require('../../lib/util/to-number');

describe("util/toNumber()", function() {
    it('parses strings', function() {
        expect(toNumber('$ 123,456')).to.equal(123456);
        expect(toNumber('$ 123,456.78')).to.equal(123456.78);
        expect(toNumber('&*()$ 123,456')).to.equal(123456);
        expect(toNumber(';$@#$%^&123,456.78')).to.equal(123456.78);

        // comma decimal
        expect(toNumber('$ 123,456', {decimalSeparator: ','})).to.equal(123.456);
        expect(toNumber('$ 123.456,78', {decimalSeparator: ','})).to.equal(123456.78);
        expect(toNumber('&*()$ 123,456', {decimalSeparator: ','})).to.equal(123.456);
        expect(toNumber(';$@#$%^&123.456,78', {decimalSeparator: ','})).to.equal(123456.78);

        // comma decimal (detection)
        expect(toNumber('$ 123,456.78')).to.equal(123456.78);
        expect(toNumber('&*()$ 123,456.78')).to.equal(123456.78);
        expect(toNumber(';$@#$%^&123,456.78')).to.equal(123456.78);

        expect(toNumber('$ 123.456,78')).to.equal(123456.78);
        expect(toNumber('&*()$ 123.456,78')).to.equal(123456.78);
        expect(toNumber(';$@#$%^&123.456,78')).to.equal(123456.78);
    });

    it('parses negatives strings', function() {
        expect(toNumber('$ -123,456')).to.equal(-123456);
        expect(toNumber('$ -123,456.78')).to.equal(-123456.78);
        expect(toNumber('&*()$ -123,456')).to.equal(-123456);
        expect(toNumber(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        // comma decimal
        expect(toNumber('$ -123,456', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber('$ -123.456,78', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(toNumber('&*()$ -123,456', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber(';$@#$%^&-123.456,78', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toNumber('$ -123,456.78')).to.equal(-123456.78);
        expect(toNumber('&*()$ -123,456.78')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&-123,456.78')).to.equal(-123456.78);

        expect(toNumber('$ -123.456,78')).to.equal(-123456.78);
        expect(toNumber('&*()$ -123.456,78')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&-123.456,78')).to.equal(-123456.78);
    });

    it('parses bracketed negatives strings', function() {
        expect(toNumber('$ (123,456)')).to.equal(-123456);
        expect(toNumber('$ (123,456.78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (-123,456)')).to.equal(-123456);
        expect(toNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(toNumber('$ (123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber('$ (123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(toNumber('&*()$ (123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber(';$@#$%^&(123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toNumber('$ (123,456.78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (123,456.78)')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&(123,456.78)')).to.equal(-123456.78);

        expect(toNumber('$ (123.456,78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (123.456,78)')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&(123.456,78)')).to.equal(-123456.78);
    });

    it('parses bracketed negatives with minus strings', function() {
        expect(toNumber('$ (-123,456)')).to.equal(-123456);
        expect(toNumber('$ (-123,456.78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (-123,456)')).to.equal(-123456);
        expect(toNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        // comma decimal
        expect(toNumber('$ (-123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber('$ (-123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);
        expect(toNumber('&*()$ (-123,456)', {decimalSeparator: ','})).to.equal(-123.456);
        expect(toNumber(';$@#$%^&(-123.456,78)', {decimalSeparator: ','})).to.equal(-123456.78);

        // comma decimal (detection)
        expect(toNumber('$ (-123,456.78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (-123,456.78)')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&(-123,456.78)')).to.equal(-123456.78);

        expect(toNumber('$ (-123.456,78)')).to.equal(-123456.78);
        expect(toNumber('&*()$ (-123.456,78)')).to.equal(-123456.78);
        expect(toNumber(';$@#$%^&(-123.456,78)')).to.equal(-123456.78);
    });

    it('parses non-strings', function() {
        expect(toNumber(123.456)).to.equal(123.456);
        expect(toNumber(123456)).to.equal(123456);
        expect(toNumber(new Number(123.456))).to.equal(123.456);
        expect(toNumber(new Number(123456))).to.equal(123456);

        expect(toNumber(undefined)).to.equal(0);
        expect(toNumber(null)).to.equal(0);
        expect(toNumber([])).to.equal(0);
        expect(toNumber({})).to.equal(0);
    });

    it('parses with different decimals', function() {
        expect(toNumber('$ 123%456', {decimalSeparator: '%'})).to.equal(123.456);
        expect(toNumber('$ 123.456|78', {decimalSeparator: '|'})).to.equal(123456.78);
        expect(toNumber('&*()$ 123>456', {decimalSeparator: '>'})).to.equal(123.456);
        expect(toNumber(';$@#$%^&123,456\'78', {decimalSeparator: '\''})).to.equal(123456.78);
    });

    it('detects comma decimalSeparator', function() {
        expect(toNumber('123.456,00')).to.equal(123456);
        expect(toNumber('123456,00')).to.equal(123456);
        expect(toNumber('123456,0')).to.equal(123456);
        expect(toNumber('123.456,0')).to.equal(123456);
        expect(toNumber('123456,')).to.equal(123456);
        expect(toNumber('123.456,')).to.equal(123456);

        expect(toNumber('123.456,78')).to.equal(123456.78);
        expect(toNumber('123456,78')).to.equal(123456.78);
        expect(toNumber('123456,7')).to.equal(123456.7);
        expect(toNumber('123.456,7')).to.equal(123456.7);

        expect(toNumber('123.456,789')).to.equal(123456.789);
        expect(toNumber('123456,789')).to.equal(123456789);
    });

    it('can be configured', function() {
        var parse = toNumber.configure({decimalSeparator: '%'});

        expect(parse('$ 123%456')).to.equal(123.456);
    });
});
