'use strict';

module.exports = options;

var extend = require('extend');
var type = require('./type');

function options(options, key, value) {
    if (arguments.length === 1) {
        return extend(true, {}, options);
    }

    if (type(key) === 'string') {
        if (type(value) === 'undefined') {
            return type(options[key]) === 'undefined' ? null : options[key];
        }

        options[key] = value;
    } else {
        extend(options, key);
    }

    return this;
}
