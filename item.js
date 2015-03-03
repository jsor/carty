var extend = require('extend');
var toFloat = require('./util/toFloat');
var getType = require('./util/getType');
var getOption = require('./util/getOption');

var _defaultOptions = {
    quantity: 1,
    price: 0
};

function createItem(options) {
    if (getType(options) === 'function') {
        options = options();
    }

    if (getType(options) === 'string') {
        options = {id: options};
    }

    if (!options.id) {
        throw 'Item must be a string or an object with at least an id property.';
    }

    var _options = extend({}, _defaultOptions, options);

    function item() {
        return extend({}, _options);
    }

    item.id = function() {
        return _options.id;
    };

    item.label = function() {
        return _options.label || _options.id;
    };

    item.quantity = function() {
        return toFloat(_options.quantity);
    };

    item.price = function() {
        return toFloat(_options.price);
    };

    item.currency = function() {
        return _options.currency;
    };

    item.shipping = function() {
        return toFloat(_options.shipping);
    };

    item.tax = function() {
        return toFloat(_options.tax);
    };

    item.equals = function(otherItem) {
        try {
            return createItem(otherItem).id() === item.id();
        } catch (e) {
            return false;
        }
    };

    return item;
}

createItem.option = getOption.bind(createItem, _defaultOptions);

module.exports = createItem;
