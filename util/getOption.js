var extend = require('extend');
var getType = require('./getType');

module.exports = function getOption(options, key) {
    if (arguments.length === 1) {
        return extend(true, {}, options);
    }

    return key && getType(options[key]) !== 'undefined' ? options[key] : null;
};
