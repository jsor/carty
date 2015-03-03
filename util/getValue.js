var getType = require('./getType');

module.exports = function getValue(value, context, args) {
    if (getType(value) === 'function') {
        return value.apply(context, args || []);
    }

    return value;
};
