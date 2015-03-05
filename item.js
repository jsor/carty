var extend = require('extend');
var number = require('./util/number');
var type = require('./util/type');

var _defaultAttributes = {
    quantity: 1,
    price: 0,
    currency: null,
    shipping: 0,
    tax: 0
};

function createItem(attributes) {
    if (type(attributes) === 'function') {
        attributes = attributes();
    }

    if (type(attributes) === 'string') {
        attributes = {id: attributes};
    }

    if (!attributes.id) {
        throw 'Item must be a string or an object with at least an id property.';
    }

    var _attributes = extend({}, _defaultAttributes, attributes);

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

    item.equals = function(otherItem) {
        try {
            return createItem(otherItem).id() === item.id();
        } catch (e) {
            return false;
        }
    };

    return item;
}

module.exports = createItem;
