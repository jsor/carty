'use strict';

module.exports = type;

var natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
};

function type(obj) {
    var str = Object.prototype.toString.call(obj);

    if (natives[str]) {
        return natives[str];
    }

    if (obj === null) {
        return 'null';
    }

    if (obj === undefined) {
        return 'undefined';
    }

    if (obj === Object(obj)) {
        return 'object';
    }

    return typeof obj;
}
