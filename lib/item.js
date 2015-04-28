'use strict';

module.exports = createItem;

var extend = require('extend');
var toNumber = require('./util/to-number');
var type = require('./util/type');

var _defaultAttributes = {
    quantity: 1
};

function normalize(attr) {
    if (type(attr) === 'string') {
        return {id: attr};
    }

    return attr;
}

function createItem(attributes) {
    var _attributes = extend({}, _defaultAttributes, normalize(attributes));

    if (!_attributes.id) {
        throw 'Item must be a string or an object with at least an id property.';
    }

    function item() {
        return extend({}, _attributes, {
            id: _attributes.id,
            label: _attributes.label || _attributes.id,
            quantity: toNumber(_attributes.quantity),
            price: toNumber(_attributes.price),
            variant: variant()
        });
    }

    function variant() {
        if (_attributes.variant == null) {
            return {};
        }

        if (type(_attributes.variant) !== 'object') {
            return {variant: _attributes.variant};
        }

        return _attributes.variant;
    }

    item.merge = function(attr) {
        return createItem(extend({}, _attributes, normalize(attr)));
    };

    item.equals = function(other) {
        try {
            var otherItem = createItem(other).call();
        } catch (e) {
            return false;
        }

        if (otherItem.id !== _attributes.id) {
            return false;
        }

        var itemVariant = variant();
        var otherVariant = otherItem.variant;

        function compare(key) {
            return otherVariant[key] === itemVariant[key];
        }

        return Object.keys(itemVariant).every(compare) && Object.keys(otherVariant).every(compare);
    };

    return item;
}
