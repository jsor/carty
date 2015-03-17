'use strict';

module.exports = toFixed;

function toFixed(value, precision, options) {
    return _toFixed(options, value, precision);
}

toFixed.configure = function(options) {
    return _toFixed.bind(undefined, options);
};

function _toFixed(options, value, precision) {
    var roundingFunction = options && options.roundingFunction || Math.round;
    var power = Math.pow(10, precision || 0);

    return (roundingFunction(value * power) / power).toFixed(precision);
}
