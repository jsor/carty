var extend = require('extend');
var number = require('./util/number');
var type = require('./util/type');

var _defaultAttributes = {
    quantity: 1,
    price: 0,
    currency: null,
    shipping: 0,
    tax: 0,
    variant: null
};

function createItem(attributes) {
    if (type(attributes) === 'function') {
        attributes = attributes();
    }

    if (type(attributes) === 'string') {
        attributes = {id: attributes};
    }

    var _attributes = extend({}, _defaultAttributes, attributes);

    if (!_attributes.id) {
        throw 'Item must be a string or an object with at least an id property.';
    }

    function item() {
        return extend({}, _attributes);
    }

    item.id = function() {
        return _attributes.id;
    };

    item.label = function() {
        return _attributes.label || _attributes.id;
    };

    item.quantity = function() {
        return number(_attributes.quantity);
    };

    item.price = function() {
        return number(_attributes.price);
    };

    item.currency = function() {
        return _attributes.currency;
    };

    item.shipping = function() {
        return number(_attributes.shipping);
    };

    item.tax = function() {
        return number(_attributes.tax);
    };

    item.variant = function() {
        return _attributes.variant;
    };

    item.equals = function(other) {
        try {
            var otherItem = createItem(other);
        } catch (e) {
            return false;
        }

        if (otherItem.id() !== item.id()) {
            return false;
        }

        var itemType = type(item.variant());

        if (type(otherItem.variant()) !== itemType) {
            return false;
        }

        var itemVariant =  item.variant(),
            otherVariant = otherItem.variant()
        ;

        if (itemType === 'object' || itemType === 'array') {
            return Object.keys(itemVariant).every(function(key) {
                return type(otherVariant[key]) !== 'undefined' && otherVariant[key] === itemVariant[key];
            });
        }

        return otherVariant === itemVariant;
    };

    return item;
}

module.exports = createItem;
