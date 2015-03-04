(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.carty = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var extend = require('extend');
var emitter = require('./util/emitter');
var number = require('./util/number');
var property = require('./util/property');
var value = require('./util/value');
var createItem = require('./item');

var resolve = Promise.resolve.bind(Promise);
var reject = Promise.reject.bind(Promise);

var _defaultOptions = {
    store: null,
    currency: 'USD',
    shipping: null,
    tax: null
};

function createCart(options) {
    var _options = extend({}, _defaultOptions, options);
    var _store = _options.store;
    var _items = [];
    var _ready = load();

    function cart() {
        return _items.slice(0);
    }

    var emit = emitter(cart);

    cart.ready = function(success) {
        ready(success);
        return cart;
    };

    cart.error = function(error) {
        ready(null, error);
        return cart;
    };

    cart.option = property.bind(cart, _options);

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
        ready(add.bind(cart, item));

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
        }, number(value(_options.shipping, cart)));
    };

    cart.tax = function() {
        if (!cart.size()) {
            return 0;
        }

        return cart().reduce(function(previous, item) {
            return previous + item.tax();
        }, number(value(_options.tax, cart)));
    };

    cart.grandTotal = function() {
        return cart.total() + cart.tax() + cart.shipping();
    };

    function ready(success, error) {
        if (!success && !error) {
            return;
        }

        _ready = _ready.then(success ? function() {
            return success(cart);
        } : null, error ? function(e) {
            return error(e, cart);
        } : null);
    }

    function load() {
        return resolve(
            _store ? _store.load() : []
        ).then(function(items) {
            _items = items.map(function(attr) {
                return createItem(attr);
            });
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

        if (item.quantity() < 1) {
            return remove(item);
        }

        if (existing) {
            _items[existing.index] = item;
        } else {
            _items.push(item);
        }

        return resolve(
            _store ? _store.add(item, cart) : null
        ).then(emit.bind(cart, 'added', item), function(e) {
            emit('addfailed', e, item);
            return reject(e);
        });
    }

    function remove(attr) {
        var existing = has(attr);

        if (!existing || !emit('remove', existing.item)) {
            return;
        }

        _items.splice(existing.index, 1);

        return resolve(
            _store ?_store.remove(existing.item, cart) : null
        ).then(emit.bind(cart, 'removed', existing.item), function(e) {
            emit('removefailed', e, existing.item);
            return reject(e);
        });
    }

    function clear() {
        if (!emit('clear')) {
            return;
        }

        _items.length = 0;

        return resolve(
            _store ? _store.clear() : null
        ).then(emit.bind(cart, 'cleared'), function(e) {
            emit('clearfailed', e);
            return reject(e);
        });
    }

    return cart;
}

createCart.option = property.bind(createCart, _defaultOptions);

module.exports = createCart;

},{"./item":3,"./util/emitter":5,"./util/number":6,"./util/property":7,"./util/value":9,"extend":4}],2:[function(require,module,exports){
var createCart = require('./cart');
var createItem = require('./item');

var carty = createCart;

carty.item = createItem;

module.exports = carty;

},{"./cart":1,"./item":3}],3:[function(require,module,exports){
var extend = require('extend');
var number = require('./util/number');
var type = require('./util/type');

var _defaultAttributes = {
    quantity: 1,
    price: 0
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

},{"./util/number":6,"./util/type":8,"extend":4}],4:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],5:[function(require,module,exports){
'use strict';

// Adapted from component-emitter
module.exports = function emitter(object) {
    var _callbacks = {};

    object.on = function(event, fn) {
        (_callbacks['$' + event] = _callbacks['$' + event] || [])
            .push(fn);

        return object;
    };

    object.once = function(event, fn) {
        function on() {
            object.off(event, on);
            fn.apply(object, arguments);
        }

        on.fn = fn;
        object.on(event, on);

        return object;
    };

    object.off = function(event, fn) {
        if (0 == arguments.length) {
            _callbacks = {};
            return object;
        }

        var callbacks = _callbacks['$' + event];
        if (!callbacks) return object;

        if (1 == arguments.length) {
            delete _callbacks['$' + event];
            return object;
        }

        var cb;
        for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        return object;
    };

    return function emit(event) {
        var args = [].slice.call(arguments, 1),
            callbacks = _callbacks['$' + event],
            passed = true
        ;

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                if (!callbacks[i].apply(object, args)) {
                    passed = false;
                }
            }
        }

        return passed;
    };
};

},{}],6:[function(require,module,exports){
module.exports = function number(value, decimal) {
    var float = parseFloat(value);

    if (isFinite(float)) {
        return float;
    }

    var string = '' + value;

    if (!decimal) {
        var dotPos = string.indexOf('.'),
            commaPos = string.indexOf(',');

        decimal = '.';

        if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
            decimal = ',';
        }
    }

    var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]);

    return parseFloat(
        string
            .replace(/\(([^-]+)\)/, "-$1") // replace bracketed values with negatives
            .replace(regex, '') // strip out any cruft
            .replace(decimal, '.') // make sure decimal point is standard
    ) || 0;
};

},{}],7:[function(require,module,exports){
var extend = require('extend');
var type = require('./type');

module.exports = function property(options, key) {
    if (arguments.length === 1) {
        return extend(true, {}, options);
    }

    return key && type(options[key]) !== 'undefined' ? options[key] : null;
};

},{"./type":8,"extend":4}],8:[function(require,module,exports){
var natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
};

module.exports = function type(obj) {
    var str = Object.prototype.toString.call(obj);

    if (natives[str]) {
        return natives[str];
    }

    if (obj === null) {
        return 'null';
    }

    if (obj === undefined) {
        return 'undefined';
    }

    if (obj === Object(obj)) {
        return 'object';
    }

    return typeof obj;
};

},{}],9:[function(require,module,exports){
var type = require('./type');

module.exports = function value(value, context, args) {
    if (type(value) === 'function') {
        return value.apply(context, args || []);
    }

    return value;
};

},{"./type":8}]},{},[2])(2)
});