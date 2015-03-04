var type = require('./type');

module.exports = function value(value, context, args) {
    if (type(value) === 'function') {
        return value.apply(context, args || []);
    }

    return value;
};
