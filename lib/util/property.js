var extend = require('extend');
var type = require('./type');

module.exports = function property(options, key) {
    if (arguments.length === 1) {
        return extend(true, {}, options);
    }

    return key && type(options[key]) !== 'undefined' ? options[key] : null;
};
