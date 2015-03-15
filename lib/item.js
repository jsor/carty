'use strict';

module.exports = createItem;

var extend = require('extend');
var parseNumber = require('./util/parse-number');
var type = require('./util/type');

var _defaultAttributes = {
    quantity: 1
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
        return parseNumber(_attributes.quantity);
    };

    item.price = function() {
        return parseNumber(_attributes.price);
    };

    item.currency = function() {
        return _attributes.currency;
    };

    item.shipping = function() {
        return parseNumber(_attributes.shipping);
    };

    item.tax = function() {
        return parseNumber(_attributes.tax);
    };

    item.variant = function() {
        if (_attributes.variant == null) {
            return {};
        }

        if (type(_attributes.variant) !== 'object') {
            return {variant: _attributes.variant};
        }

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

        var itemVariant =  item.variant();
        var otherVariant = otherItem.variant();

        return Object.keys(itemVariant).every(function(key) {
            return otherVariant[key] === itemVariant[key];
        });
    };

    return item;
}
