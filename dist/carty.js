/*!
 * Carty - v0.1.0 - 2015-03-07
 * http://sorgalla.com/carty/
 * Copyright (c) 2015 Jan Sorgalla; Licensed MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var createCart = __webpack_require__(1);
	var createItem = __webpack_require__(2);

	var carty = createCart;

	carty.item = createItem;

	module.exports = carty;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extend = __webpack_require__(8);
	var emitter = __webpack_require__(3);
	var number = __webpack_require__(4);
	var property = __webpack_require__(5);
	var value = __webpack_require__(6);
	var createItem = __webpack_require__(2);

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

	    cart.currency = function() {
	        return _options.currency;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(8);
	var number = __webpack_require__(4);
	var type = __webpack_require__(7);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(8);
	var type = __webpack_require__(7);

	module.exports = function property(options, key) {
	    if (arguments.length === 1) {
	        return extend(true, {}, options);
	    }

	    return key && type(options[key]) !== 'undefined' ? options[key] : null;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var type = __webpack_require__(7);

	module.exports = function value(value, context, args) {
	    if (type(value) === 'function') {
	        return value.apply(context, args || []);
	    }

	    return value;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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



/***/ }
/******/ ]);