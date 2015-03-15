'use strict';

module.exports = formatNumber;

var parseNumber = require('./parse-number');
var type = require('./type');

function formatNumber(value, options) {
    return _formatNumber(options, value);
}

formatNumber.configure = function(options) {
    return _formatNumber.bind(undefined, options);
};

function _formatNumber(options, value) {
    var number = parseNumber(value);

    options = options || {};

    var isNeg = (number < 0),
        output = number + '',
        precision = options.precision,
        decSep = options.decimalSeparator || '.',
        thouSep = options.thousandsSeparator,
        decIndex,
        newOutput, count, i;

    // Decimal precision
    if (type(precision) === 'number' && precision >= 0 && precision <= 20) {
        // Round to the correct decimal place
        output = number.toFixed(precision);
    }

    // Decimal separator
    if (decSep !== '.') {
        output = output.replace('.', decSep);
    }

    // Add the thousands separator
    if (thouSep) {
        // Find the dot or where it would be
        decIndex = output.lastIndexOf(decSep);
        decIndex = (decIndex > -1) ? decIndex : output.length;
        // Start with the dot and everything to the right
        newOutput = output.substring(decIndex);
        // Working left, every third time add a separator, every time add a digit
        for (count = 0, i = decIndex; i > 0; i--) {
            if ((count % 3 === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
                newOutput = thouSep + newOutput;
            }
            newOutput = output.charAt(i - 1) + newOutput;
            count++;
        }
        output = newOutput;
    }

    return (options.prefix || '') + output + (options.suffix || '');
}
