var expect = require('chai').expect;
var formatCurrency = require('../../lib/format/currency');
var currencies = require('../../lib/format/currencies');

var customCurrencies = {
    'CUSTOM': {
        prefix: 'CUS ',
        suffix: ' CUS',
        precision: 4,
        decimalSeparator: '%',
        thousandsSeparator: '?'
    }
};

describe("format/currency()", function() {
    it('formats currencies', function() {
        expect(formatCurrency(123456)).to.equal('123456.00');
        expect(formatCurrency(123456.78)).to.equal('123456.78');
        expect(formatCurrency(123456.7891)).to.equal('123456.79');

        expect(formatCurrency(123456, 'CURRENCY')).to.equal('123456.00 CURRENCY');
        expect(formatCurrency(123456.78, 'CURRENCY')).to.equal('123456.78 CURRENCY');
        expect(formatCurrency(123456.7891, 'CURRENCY')).to.equal('123456.79 CURRENCY');

        expect(formatCurrency(123456, 'USD')).to.equal('$123456.00');
        expect(formatCurrency(123456.78, 'USD')).to.equal('$123456.78');
        expect(formatCurrency(123456.7891, 'USD')).to.equal('$123456.79');

        expect(formatCurrency(123456, 'USD')).to.equal('$123456.00');
        expect(formatCurrency(123456.78, 'USD')).to.equal('$123456.78');
        expect(formatCurrency(123456.7891, 'USD')).to.equal('$123456.79');

        // after
        expect(formatCurrency(123456, 'ARS')).to.equal('$123456.00 ARS');
        expect(formatCurrency(123456.78, 'ARS')).to.equal('$123456.78 ARS');
        expect(formatCurrency(123456.7891, 'ARS')).to.equal('$123456.79 ARS');

        // precision
        expect(formatCurrency(123456, 'BTC')).to.equal('123456.0000 BTC');
        expect(formatCurrency(123456.78, 'BTC')).to.equal('123456.7800 BTC');
        expect(formatCurrency(123456.7891, 'BTC')).to.equal('123456.7891 BTC');

        expect(formatCurrency(123456, 'JPY')).to.equal('¥123456');
        expect(formatCurrency(123456.78, 'JPY')).to.equal('¥123457');
        expect(formatCurrency(123456.7891, 'JPY')).to.equal('¥123457');

        // custom currency
        expect(formatCurrency(123456, 'CUSTOM', {currencies: customCurrencies})).to.equal('CUS 123?456%0000 CUS');
        expect(formatCurrency(123456.78, 'CUSTOM', {currencies: customCurrencies})).to.equal('CUS 123?456%7800 CUS');
        expect(formatCurrency(123456.789666, 'CUSTOM', {currencies: customCurrencies})).to.equal('CUS 123?456%7897 CUS');

        // unknown currency
        expect(formatCurrency(123456, 'CURRENCY')).to.equal('123456.00 CURRENCY');
        expect(formatCurrency(123456.78, 'CURRENCY')).to.equal('123456.78 CURRENCY');
        expect(formatCurrency(123456.7891, 'CURRENCY')).to.equal('123456.79 CURRENCY');
    });

    it('can be configured', function() {
        var format = formatCurrency.configure({currencies: currencies});

        expect(format(123456, 'USD')).to.equal('$123456.00');
        expect(format(123456.78, 'USD')).to.equal('$123456.78');
        expect(format(123456.7891, 'USD')).to.equal('$123456.79');
    });

    it('can be configured for currency', function() {
        var format = formatCurrency.configure({currencies: currencies}).currency('USD');

        expect(format(123456)).to.equal('$123456.00');
        expect(format(123456.78)).to.equal('$123456.78');
        expect(format(123456.7891)).to.equal('$123456.79');
    });
});
