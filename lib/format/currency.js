'use strict';

module.exports = formatCurrency;

var extend = require('extend');
var defaultCurrencies = require('./currencies');
var formatNumber = require('./number');

function formatCurrency(value, currency, options) {
    return _formatCurrency(options, value, currency);
}

formatCurrency.configure = function(options) {
    var formatter = _formatCurrency.bind(undefined, options);

    formatter.currency = function(currency) {
        return function (value) {
            return formatter(value, currency);
        };
    };

    return formatter;
};

function _formatCurrency(options, value, currency) {
    var currencies = options && options.currencies || defaultCurrencies;
    var currencyOpts = currencies[currency] || {suffix: currency ? ' ' + currency : ''};

    var opts = extend(
        {precision: 2},
        currencyOpts,
        options
    );

    return formatNumber(value, opts);
}
