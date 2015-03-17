var expect = require('chai').expect;
var formatNumber = require('../../lib/format/number');

describe("format/number()", function() {
    it('formats numbers', function() {
        expect(formatNumber(123456.78)).to.equal('123456.78');
        expect(formatNumber(-123456.78, {precision: 4, decimalSeparator: '%', thousandsSeparator: ';', prefix: 'FOO ', suffix: ' BAR'})).to.equal('FOO -123;456%7800 BAR');
        expect(formatNumber(-123456, {precision: 0, decimalSeparator: '%', thousandsSeparator: ';', prefix: 'FOO ', suffix: ' BAR'})).to.equal('FOO -123;456 BAR');
    });

    it('can be configured', function() {
        var format = formatNumber.configure({precision: 2, decimalSeparator: '%', thousandsSeparator: ';', prefix: 'FOO ', suffix: ' BAR'});

        expect(format(123456)).to.equal('FOO 123;456%00 BAR');
    });
});
