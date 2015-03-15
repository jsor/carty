'use strict';

module.exports = value;

var type = require('./type');

function value(value, context, args) {
    if (type(value) === 'function') {
        return value.apply(context, args || []);
    }

    return value;
}
