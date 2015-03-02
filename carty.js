'use strict';

var extend = require('extend');
var emitter = require('./util/emitter');

var hasOwn = Object.prototype.hasOwnProperty;

function isTypeOf(type, item) {
    return typeof item === type;
}

var isString = isTypeOf.bind(null, typeof "");
var isUndefined = isTypeOf.bind(null, typeof undefined);
var isFunction = isTypeOf.bind(null, typeof isTypeOf);
var isObject = isTypeOf.bind(null, typeof {});

function toFloat(value) {
    return parseFloat(value) || 0;
}

function getFloat(value, context, args) {
    if (isFunction(value)) {
        value = value.apply(context, args);
    }

    return toFloat(value);
}

function getOption(options, key) {
    if (arguments.length === 1) {
        return extend({}, options);
    }

    return key && !isUndefined(options[key]) ? options[key] : null;
}

var _defaultOptions = {
    store: null,
    currency: 'USD',
    shipping: null,
    tax: null
};

var _defaultAttributes = {
    quantity: 1,
    price: 0,
    currency: null,
    shipping: null,
    tax: null
};

function createItem(attr) {
    if (isFunction(attr)) {
        attr = attr();
    }

    if (isString(attr)) {
        attr = {id: attr};
    }

    if (!isObject(attr) || (!attr.label && !attr.id)) {
        throw 'Item must be a string or an object with at least an id or label attribute.';
    }

    var _attr = extend({}, _defaultAttributes, attr);

    function item() {
        return extend({}, _attr);
    }

    item.id = function() {
        return _attr.id || _attr.label;
    };

    item.label = function() {
        return _attr.label || _attr.id;
    };

    item.quantity = function() {
        return _attr.quantity;
    };

    item.price = function() {
        return _attr.price;
    };

    item.currency = function() {
        return _attr.currency;
    };

    item.shipping = function() {
        return _attr.shipping;
    };

    item.tax = function() {
        return _attr.tax;
    };

    item.equals = function(otherItem) {
        if (!isObject(otherItem) && !isFunction(otherItem)) {
            return false;
        }

        otherItem = createItem(otherItem);

        if (otherItem.id() && this.id() === otherItem.id()) {
            return true;
        }

        var name, otherAttr = otherItem();

        for (name in _attr) {
            if ('quantity' === name || !hasOwn.call(_attr, name)) {
                continue;
            }

            if (isUndefined(otherAttr[name]) || otherAttr[name] !== _attr[name]) {
                return false;
            }
        }

        return true;
    };

    return item;
}

function createCart(options) {
    var _options = extend({}, _defaultOptions, options);
    var _store = _options.store;

    var _items = load();

    function load() {
        if (!_store) {
            return [];
        }

        return _store.load().map(function(attr, index) {
            return createItem(attr, index);
        });
    }

    function save() {
        _store && _store.save(_items.map(function(item) {
            return item();
        }));
    }

    function has(attr) {
        var checkItem, found = false;

        try {
            checkItem = createItem(attr);
        } catch (e) {
            return false;
        }

        _items.every(function(item, index) {
            if (checkItem.equals(item)) {
                found = {item: item, index: index};
            }

            return !found;
        });

        return found;
    }

    function add(attr) {
        var item = createItem(attr),
            existing = has(item)
        ;

        if (existing) {
            var newAttr = extend({}, existing.item(), item(), {
                quantity: existing.item.quantity() + item.quantity()
            });

            _items[existing.index] = createItem(newAttr);
        } else {
            _items.push(item);
        }

        save();

        return item;
    }

    function remove(attr) {
        var existing = has(attr);

        if (existing) {
            _items.splice(existing.index, 1);
            save();
            return existing.item;
        }

        return null;
    }

    function clear() {
        _items.length = 0;
        _store && _store.clear();

    }

    function cart() {
        return _items.slice(0);
    }

    var emit = emitter(cart);

    cart.option = getOption.bind(cart, _options);

    cart.size = function() {
        return _items.length;
    };

    cart.has = function(item) {
        return !!has(item);
    };

    cart.get = function(item) {
        var found = has(item);
        return !found ? null : found.item;
    };

    cart.add = function(item) {
        if (emit('add', item)) {
            emit('added', add(item));
        }

        return cart;
    };

    cart.remove = function(item) {
        if (emit('remove', item)) {
            emit('removed', remove(item));
        }

        return cart;
    };

    cart.clear = function() {
        if (emit('clear')) {
            clear();
            emit('cleared');
        }

        return cart;
    };

    cart.each = function(callback, context) {
        _items.every(function(item, index) {
            return !!callback.call(context, item, index, this);
        }, this);

        return cart;
    };

    cart.quantity = function () {
        return cart().reduce(function (previous, item) {
            return previous + toFloat(item.quantity());
        }, 0);
    };

    cart.total = function () {
        return cart().reduce(function (previous, item) {
            return previous + (getFloat(item.price(), cart, [item]) * toFloat(item.quantity()));
        }, 0);
    };

    cart.shipping = function () {
        if (!cart.size()) {
            return 0;
        }

        return cart().reduce(function (previous, item) {
            return previous + getFloat(item.shipping(), cart, [item]);
        }, getFloat(_options.shipping, cart));
    };

    cart.tax = function () {
        if (!cart.size()) {
            return 0;
        }

        return cart().reduce(function (previous, item) {
            return previous + getFloat(item.tax(), cart, [item]);
        }, getFloat(_options.tax, cart));
    };

    cart.grandTotal = function () {
        return cart.total() + cart.tax() + cart.shipping();
    };

    return cart;
}

function carty(options) {
    return createCart(options);
}

carty.version = '@VERSION';
carty.option = getOption.bind(carty, _defaultOptions);

module.exports = carty;
