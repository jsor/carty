'use strict';

module.exports = formatCurrency;

var extend = require('extend');
var defaultCurrencies = require('../data/currencies');
var formatNumber = require('./number');

function formatCurrency(value, options) {
    return _formatCurrency(options, value);
}

formatCurrency.configure = function(options) {
    return _formatCurrency.bind(undefined, options);
};

function _formatCurrency(options, value) {
    options = options || {};

    var currency = options.currency;
    var currencies = options.currencies || defaultCurrencies;
    var currencyOpts = currencies[currency] || {suffix: currency ? ' ' + currency : ''};

    var opts = extend(
        {precision: 2},
        currencyOpts,
        options
    );

    return formatNumber(value, opts);
}
