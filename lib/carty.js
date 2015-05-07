'use strict';

module.exports = createCart;

var extend = require('extend');
var emitter = require('./util/emitter');
var toNumber = require('./util/to-number');
var options = require('./util/options');
var value = require('./util/value');
var type = require('./util/type');

var resolve = Promise.resolve.bind(Promise);
var reject = Promise.reject.bind(Promise);

var _defaultOptions = {
    storage: null,
    shipping: null,
    tax: null
};

var _defaultItemAttributes = {
    quantity: 1
};

function createCart(opts) {
    var _options = extend({}, _defaultOptions, opts);
    var _items = [];
    var _ready = load();

    function cart() {
        return {
            size: cart.size(),
            quantity: cart.quantity(),
            subtotal: cart.subtotal(),
            shipping: cart.shipping(),
            tax: cart.tax(),
            total: cart.total(),
            items: _items.map(function(item) {
                return item();
            })
        };
    }

    var emit = emitter(cart);

    cart.on(['add', 'update', 'remove', 'clear'], emit.bind(undefined, 'change'));
    cart.on(['added', 'updated', 'removed', 'cleared'], emit.bind(undefined, 'changed'));
    cart.on(['addfailed', 'updatefailed', 'removefailed', 'clearfailed'], emit.bind(undefined, 'changefailed'));

    cart.options = options.bind(cart, _options);

    cart.ready = function(onReady) {
        ready(onReady);

        return cart;
    };

    cart.error = function(onError) {
        error(onError);

        return cart;
    };

    cart.size = function() {
        return _items.length;
    };

    cart.has = function(item) {
        return !!has(item);
    };

    cart.get = function(item) {
        var found = has(item);

        return !found ? null : found.item();
    };

    cart.add = function(item) {
        ready(add.bind(cart, item));

        return cart;
    };

    cart.update = function(item) {
        ready(update.bind(cart, item));

        return cart;
    };

    cart.remove = function(item) {
        ready(remove.bind(cart, item));

        return cart;
    };

    cart.clear = function() {
        ready(clear);

        return cart;
    };

    cart.each = function(callback, context) {
        _items.every(function(item, index) {
            return false !== callback.call(context, item(), index, cart);
        });

        return cart;
    };

    cart.quantity = function() {
        return _items.reduce(function(previous, item) {
            return previous + item().quantity;
        }, 0);
    };

    cart.subtotal = function() {
        return _items.reduce(function(previous, item) {
            var state = item();
            return previous + (state.price * state.quantity);
        }, 0);
    };

    cart.shipping = function() {
        if (!cart.size()) {
            return 0;
        }

        return toNumber(value(_options.shipping, undefined, [cart]), _options);
    };

    cart.tax = function() {
        if (!cart.size()) {
            return 0;
        }

        return toNumber(value(_options.tax, undefined, [cart]), _options);
    };

    cart.total = function() {
        return cart.subtotal() + cart.tax() + cart.shipping();
    };

    cart.item = function(attr) {
        return createItem(attr);
    };

    function ready(onReady) {
        _ready['catch'](function(e) {
            setTimeout(function() { throw e; });
        });

        _ready = _ready.then(function() {
            return onReady(cart);
        });
    }

    function error(onError) {
        _ready = _ready['catch'](function(e) {
            return onError(e, cart);
        });
    }

    function load() {
        return resolve(
            _options.storage && _options.storage.load()
        ).then(function(items) {
            if (type(items) === 'array') {
                _items = items.map(function(attr) {
                    return createItem(attr);
                });
            }
        });
    }

    function has(attr) {
        var checkItem;
        var found = false;

        try {
            checkItem = createItem(attr).call();
        } catch (e) {
            return false;
        }

        _items.every(function(item, index) {
            if (item.equals(checkItem)) {
                found = {item: item, index: index};
            }

            return !found;
        });

        return found;
    }

    function update(attr) {
        return emit('update', attr).then(function() {
            var existing = has(attr);

            if (!existing) {
                return;
            }

            var item = existing.item.merge(attr);
            var state = item();

            if (state.quantity < 1) {
                return remove(state);
            }

            _items[existing.index] = item;

            return resolve(
                _options.storage && _options.storage.update(state, cart)
            ).then(emit.bind(cart, 'updated', state), function(e) {
                emit('updatefailed', e, state);
                return reject(e);
            }, function() {
                // Catch updated event listener rejections
            });
        }, function() {
            // Catch update event listener rejections
        });
    }

    function add(attr) {
        return emit('add', attr).then(function() {
            var item = createItem(attr);
            var existing = has(attr);

            if (existing) {
                attr = extend({}, attr, {
                    quantity: existing.item().quantity + item().quantity
                });

                item = existing.item.merge(attr);
            }

            var state = item();

            if (state.quantity < 1) {
                return remove(state);
            }

            if (existing) {
                _items[existing.index] = item;
            } else {
                _items.push(item);
            }

            return resolve(
                _options.storage && _options.storage.add(state, cart)
            ).then(emit.bind(cart, 'added', state), function(e) {
                emit('addfailed', e, state);
                return reject(e);
            }, function() {
                // Catch added event listener rejections
            });
        }, function() {
            // Catch add event listener rejections
        });
    }

    function remove(attr) {
        return emit('remove', attr).then(function() {
            var existing = has(attr);

            if (!existing) {
                return;
            }

            _items.splice(existing.index, 1);

            var state = existing.item();

            return resolve(
                _options.storage && _options.storage.remove(state, cart)
            ).then(emit.bind(cart, 'removed', state), function(e) {
                emit('removefailed', e, state);
                return reject(e);
            }, function() {
                // Catch removed event listener rejections
            });
        }, function() {
            // Catch remove event listener rejections
        });
    }

    function clear() {
        return emit('clear').then(function() {
            _items.length = 0;

            return resolve(
                _options.storage && _options.storage.clear()
            ).then(emit.bind(cart, 'cleared'), function(e) {
                emit('clearfailed', e);
                return reject(e);
            }, function() {
                // Catch cleared event listener rejections
            });
        }, function() {
            // Catch clear event listener rejections
        });
    }

    function normalize(attr) {
        if (type(attr) === 'function') {
            attr = attr(cart);
        }

        if (type(attr) !== 'object') {
            return {id: attr};
        }

        return attr;
    }

    function createItem(attributes) {
        var _attributes = extend({}, _defaultItemAttributes, normalize(attributes));

        if (!_attributes.id) {
            throw 'Item must be a string or an object with at least an id property.';
        }

        function item() {
            return extend({}, _attributes, {
                id: _attributes.id,
                label: _attributes.label || _attributes.id,
                quantity: toNumber(_attributes.quantity, _options),
                price: toNumber(_attributes.price, _options),
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

    return cart;
}

createCart.options = options.bind(createCart, _defaultOptions);
