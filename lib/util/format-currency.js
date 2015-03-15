'use strict';

module.exports = formatCurrency;

var extend = require('extend');
var formatNumber = require('./format-number');

function formatCurrency(value, options) {
    return _formatCurrency(options, value);
}

formatCurrency.configure = function(options) {
    return _formatCurrency.bind(undefined, options);
};

function _formatCurrency(options, value) {
    options= options || {};

    var currencies = options.currencies || {};
    var currency = options.currency;

    options = extend({}, {precision: 2}, currencies[currency] || {suffix: currency ? ' ' + currency : ''}, options);

    return formatNumber(value, options);
}
