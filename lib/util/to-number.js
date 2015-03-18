'use strict';

module.exports = toNumber;

var numIsFinite = Number.isFinite || function(value) {
    return typeof value === 'number' && isFinite(value);
};

function toNumber(value, options) {
    return _toNumber(options, value);
}

toNumber.configure = function(options) {
    return _toNumber.bind(undefined, options);
};

function _toNumber(options, value) {
    if (numIsFinite(value)) {
        return value;
    }

    var decimalSeparator = options && options.decimalSeparator || '.';

    var string = '' + value;

    var dotPos = string.indexOf('.');
    var commaPos = string.indexOf(',');

    if (commaPos > -1) {
        if (dotPos > -1 && commaPos > dotPos) {
            decimalSeparator = ',';
        } else if (dotPos === -1) {
            var decimalLength = string.substr(commaPos + 1).length;
            if (decimalLength > 0 && decimalLength < 3) {
                decimalSeparator = ',';
            }
        }
    }

    if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
        decimalSeparator = ',';
    } else if (dotPos === -1 && commaPos > -1 && string.substr(commaPos + 1).length < 3) {
        decimalSeparator = ',';
    }

    var regex = new RegExp("[^0-9-" + decimalSeparator + "]", ["g"]);

    return parseFloat(
        string
            .replace(/\(([^-]+)\)/, "-$1") // replace bracketed values with negatives
            .replace(regex, '') // strip out any cruft
            .replace(decimalSeparator, '.') // make sure decimal separator is standard
    ) || 0;
}
