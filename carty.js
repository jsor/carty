'use strict';

var extend = require('extend');
var emitter = require('./util/emitter');
var toFloat = require('./util/toFloat');
var getType = require('./util/getType');
var getOption = require('./util/getOption');
var getValue = require('./util/getValue');

var _defaultOptions = {
    store: null,
    currency: 'USD',
    shipping: null,
    tax: null
};

var _defaultAttributes = {
    quantity: 1,
    price: 0
};

function createItem(attr) {
    if (getType(attr) === 'function') {
        attr = attr();
    }

    if (getType(attr) === 'string') {
        attr = {id: attr};
    }

    if (!attr.id) {
        throw 'Item must be a string or an object with at least an id attribute.';
    }

    var _attr = extend({}, _defaultAttributes, attr);

    function item() {
        return extend({}, _attr);
    }

    item.id = function() {
        return _attr.id;
    };

    item.label = function() {
        return _attr.label || _attr.id;
    };

    item.quantity = function() {
        return toFloat(_attr.quantity);
    };

    item.price = function() {
        return toFloat(_attr.price);
    };

    item.currency = function() {
        return _attr.currency;
    };

    item.shipping = function() {
        return toFloat(_attr.shipping);
    };

    item.tax = function() {
        return toFloat(_attr.tax);
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

function createCart(options) {
    var _options = extend({}, _defaultOptions, options);
    var _store = _options.store;
    var _items = [];

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
        add(item);

        return cart;
    };

    cart.remove = function(item) {
        remove(item);

        return cart;
    };

    cart.clear = function() {
        clear();

        return cart;
    };

    cart.each = function(callback, context) {
        _items.every(function(item, index) {
            return false !== callback.call(context, item, index, cart);
        });

        return cart;
    };

    cart.quantity = function() {
        return cart().reduce(function(previous, item) {
            return previous + item.quantity();
        }, 0);
    };

    cart.total = function() {
        return cart().reduce(function(previous, item) {
            return previous + (item.price() * item.quantity());
        }, 0);
    };

    cart.shipping = function() {
        if (!cart.size()) {
            return 0;
        }

        return cart().reduce(function(previous, item) {
            return previous + item.shipping();
        }, toFloat(getValue(_options.shipping, cart)));
    };

    cart.tax = function() {
        if (!cart.size()) {
            return 0;
        }

        return cart().reduce(function(previous, item) {
            return previous + item.tax();
        }, toFloat(getValue(_options.tax, cart)));
    };

    cart.grandTotal = function() {
        return cart.total() + cart.tax() + cart.shipping();
    };

    function load() {
        if (!_store || !_store.enabled()) {
            return;
        }

        return _store.load(function(items) {
            _items = items.map(function(attr) {
                return createItem(attr);
            });
        });
    }

    function save() {
        if (!emit('save')) {
            return;
        }

        if (!_store || !_store.enabled()) {
            return emit('saved');
        }

        _store.save(_items.map(function(item) {
            return item();
        }), function() {
            emit('saved');
        });
    }

    function clear() {
        if (!emit('clear')) {
            return;
        }

        _items.length = 0;

        if (!_store || !_store.enabled()) {
            return emit('cleared');
        }

        _store.clear(function() {
            emit('cleared');
        });
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
        var item = createItem(attr);

        if (!emit('add', item)) {
            return;
        }

        var existing = has(item);

        if (existing) {
            item = createItem(extend({}, existing.item(), item(), {
                quantity: existing.item.quantity() + item.quantity()
            }));
        }

        if (item.quantity() <= 0) {
            return remove(item);
        }

        if (existing) {
            _items[existing.index] = item;
        } else {
            _items.push(item);
        }

        save();

        emit('added', item);
    }

    function remove(attr) {
        var existing = has(attr);

        if (!existing || !emit('remove', existing.item)) {
            return;
        }

        _items.splice(existing.index, 1);
        save();

        emit('removed', existing.item);
    }

    load();

    return cart;
}

function carty(options) {
    return createCart(options);
}

carty.option = getOption.bind(carty, _defaultOptions);
carty.item = createItem;

module.exports = carty;
