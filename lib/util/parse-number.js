'use strict';

module.exports = parseNumber;

function parseNumber(value, options) {
    return _parseNumber(options, value);
}

parseNumber.configure = function(options) {
    return _parseNumber.bind(undefined, options);
};

function _parseNumber(options, value) {
    var float = parseFloat(value);

    if (isFinite(float)) {
        return float;
    }

    options = options || {};

    var decimalSeparator = options && options.decimalSeparator;

    var string = '' + value;

    if (!decimalSeparator) {
        var dotPos = string.indexOf('.');
        var commaPos = string.indexOf(',');

        decimalSeparator = '.';

        if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
            decimalSeparator = ',';
        }
    }

    var regex = new RegExp("[^0-9-" + decimalSeparator + "]", ["g"]);

    return parseFloat(
            string
                .replace(/\(([^-]+)\)/, "-$1") // replace bracketed values with negatives
                .replace(regex, '') // strip out any cruft
                .replace(decimalSeparator, '.') // make sure decimal separator is standard
        ) || 0;
}
