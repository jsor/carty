'use strict';

module.exports = formatNumber;

var toNumber = require('../util/to-number');
var toFixed = require('../util/to-fixed');
var type = require('../util/type');

function formatNumber(value, options) {
    return _formatNumber(options, value);
}

formatNumber.configure = function(options) {
    return _formatNumber.bind(undefined, options);
};

function _formatNumber(options, value) {
    var number = toNumber(value);

    options = options || {};

    var isNeg = (number < 0),
        output = number + '',
        precision = options.precision,
        decSep = options.decimalSeparator || '.',
        groupSep = options.groupingSeparator,
        groupSize = type(options.groupingSize) === 'number' ? options.groupingSize : 3,
        decIndex,
        newOutput, count, i;

    // Decimal precision
    if (type(precision) === 'number') {
        // Round to the correct decimal place
        output = toFixed(number, precision);
    }

    // Decimal separator
    if (decSep !== '.') {
        output = output.replace('.', decSep);
    }

    // Add the grouping separator
    if (groupSep) {
        // Find the dot or where it would be
        decIndex = output.lastIndexOf(decSep);
        decIndex = (decIndex > -1) ? decIndex : output.length;
        // Start with the dot and everything to the right
        newOutput = output.substring(decIndex);
        // Working left, every third time add a separator, every time add a digit
        for (count = 0, i = decIndex; i > 0; i--) {
            if ((count % groupSize === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
                newOutput = groupSep + newOutput;
            }
            newOutput = output.charAt(i - 1) + newOutput;
            count++;
        }
        output = newOutput;
    }

    return (options.prefix || '') + output + (options.suffix || '');
}
