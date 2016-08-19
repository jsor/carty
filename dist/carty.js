/*!
 * Carty - v0.8.0 - 2016-08-19
 * http://sorgalla.com/carty/
 * Copyright (c) 2015-2016 Jan Sorgalla; Licensed MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["carty"] = factory(require("jquery"));
	else
		root["carty"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
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

	'use strict';

	var carty = __webpack_require__(1);

	carty.format = {
	    currency: __webpack_require__(8),
	    number: __webpack_require__(10)
	};

	carty.storage = {
	    localStorage: __webpack_require__(12)
	};

	carty.ui = {
	    jquery: __webpack_require__(13)
	};

	module.exports = carty;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = carty;

	var extend = __webpack_require__(2);
	var emitter = __webpack_require__(3);
	var toNumber = __webpack_require__(5);
	var options = __webpack_require__(6);
	var value = __webpack_require__(7);
	var type = __webpack_require__(4);

	var resolve = Promise.resolve.bind(Promise);
	var reject = Promise.reject.bind(Promise);

	var _defaultOptions = {
	    storage: null,
	    subtotal: function(cart) {
	        return cart.items().reduce(function(previous, item) {
	            return previous + (item.price * item.quantity);
	        }, 0);
	    },
	    shipping: null,
	    tax: null
	};

	var _defaultItemAttributes = {
	    quantity: 1
	};

	function carty(opts) {
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

	    var _options = extend({}, _defaultOptions, opts);
	    var _items = [];
	    var _ready;

	    cart.on(['load', 'add', 'update', 'remove', 'clear', 'checkout'], emit.bind(undefined, 'change'));
	    cart.on(['loaded', 'added', 'updated', 'removed', 'cleared', 'checkedout'], emit.bind(undefined, 'changed'));
	    cart.on(['loadfailed', 'addfailed', 'updatefailed', 'removefailed', 'clearfailed', 'checkoutfailed'], emit.bind(undefined, 'changefailed'));

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

	    cart.checkout = function(data) {
	        ready(checkout.bind(cart, data));

	        return cart;
	    };

	    cart.load = function() {
	        if (!_ready) {
	            _ready = load();
	        } else {
	            ready(load);
	        }

	        return cart;
	    };

	    cart.changed = function() {
	        if (!_ready) {
	            _ready = emit('changed');
	        } else {
	            ready(emit.bind(undefined, 'changed'));
	        }

	        return cart;
	    };

	    cart.each = function(callback, context) {
	        _items.every(function(item, index) {
	            return false !== callback.call(context, item(), index, cart);
	        });

	        return cart;
	    };

	    cart.items = function() {
	        return _items.map(function(item) {
	            return item();
	        });
	    };

	    cart.quantity = function() {
	        return _items.reduce(function(previous, item) {
	            return previous + item().quantity;
	        }, 0);
	    };

	    cart.subtotal = function() {
	        return toNumber(value(_options.subtotal, undefined, [cart]), _options);
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
	        if (!_ready) {
	            _ready = load();
	        }

	        _ready['catch'](function(e) {
	            setTimeout(function() { throw e; });
	        });

	        _ready = _ready.then(function() {
	            return onReady(cart);
	        });
	    }

	    function error(onError) {
	        if (!_ready) {
	            _ready = load();
	        }

	        _ready = _ready['catch'](function(e) {
	            return onError(e, cart);
	        });
	    }

	    function load() {
	        return emit('load').then(function() {
	            return resolve(
	                _options.storage && _options.storage.load(cart)
	            ).then(function(items) {
	                if (type(items) === 'array') {
	                    _items = items.map(function(attr) {
	                        return createItem(attr);
	                    });
	                }
	            }).then(emit.bind(cart, 'loaded'), function(e) {
	                    emit('loadfailed', e);
	                    return reject(e);
	            });
	        }, function() {
	            // Catch load event listener rejections
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
	                _options.storage && _options.storage.put(state, cart)
	            ).then(emit.bind(cart, 'updated', state), function(e) {
	                emit('updatefailed', e, state);
	                return reject(e);
	            })['catch'](function() {
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
	                _options.storage && _options.storage.put(state, cart)
	            ).then(emit.bind(cart, 'added', state), function(e) {
	                emit('addfailed', e, state);
	                return reject(e);
	            })['catch'](function() {
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
	            })['catch'](function() {
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
	                _options.storage && _options.storage.clear(cart)
	            ).then(emit.bind(cart, 'cleared'), function(e) {
	                emit('clearfailed', e);
	                return reject(e);
	            })['catch'](function() {
	                // Catch cleared event listener rejections
	            });
	        }, function() {
	            // Catch clear event listener rejections
	        });
	    }

	    function checkout(data) {
	        return emit('checkout').then(function() {
	            return resolve(
	                _options.storage && _options.storage.checkout(data, cart)
	            )
	            .then(function(value) {
	                _items.length = 0;

	                return value;
	            })
	            .then(emit.bind(cart, 'checkedout'), function(e) {
	                emit('checkoutfailed', e);
	                return reject(e);
	            })['catch'](function() {
	                // Catch checkedout event listener rejections
	            });
	        }, function() {
	            // Catch checkout event listener rejections
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

	            function compareValue(value1, value2) {
	                if ('number' === type(value1)) {
	                    value1 = '' + value1;
	                }

	                if ('number' === type(value2)) {
	                    value2 = '' + value2;
	                }

	                return value1 === value2;
	            }

	            if (!compareValue(otherItem.id, _attributes.id)) {
	                return false;
	            }

	            var itemVariant = variant();
	            var otherVariant = otherItem.variant;

	            function compare(key) {
	                return compareValue(otherVariant[key], itemVariant[key]);
	            }

	            return Object.keys(itemVariant).every(compare) && Object.keys(otherVariant).every(compare);
	        };

	        return item;
	    }

	    return cart;
	}

	carty.options = options.bind(carty, _defaultOptions);


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
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
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = emitter;

	var type = __webpack_require__(4);

	function isArray(value) {
	    return type(value) === 'array';
	}

	// Adapted from component-emitter
	function emitter(object) {
	    var _callbacks = {};

	    object.on = function(event, fn) {
	        if (isArray(event)) {
	            event.forEach(function(evt) {
	                object.on(evt, fn);
	            });
	        } else {
	            (_callbacks['$' + event] = _callbacks['$' + event] || [])
	                .push(fn);
	        }

	        return object;
	    };

	    object.once = function(event, fn) {
	        if (isArray(event)) {
	            event.forEach(function(evt) {
	                object.once(evt, fn);
	            });

	            return object;
	        }

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

	        if (isArray(event)) {
	            event.forEach(function(evt) {
	                object.off(evt, fn);
	            });

	            return object;
	        }

	        var callbacks = _callbacks['$' + event];

	        if (!callbacks) {
	            return object;
	        }

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
	        var args = [].slice.call(arguments, 1), ret;

	        if (isArray(event)) {
	            return Promise.all(event.map(function(evt) {
	                return emit.apply(object, [evt].concat(args));
	            }));
	        }

	        var callbacks = _callbacks['$' + event];

	        if (!callbacks) {
	            return Promise.resolve();
	        }

	        return Promise.all(callbacks.slice(0).map(function(callback) {
	            ret = callback.apply(object, args);

	            if (false === ret) {
	                return Promise.reject();
	            }

	            return ret;
	        }));
	    };
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = type;

	var natives = {
	    '[object Arguments]': 'arguments',
	    '[object Array]': 'array',
	    '[object Date]': 'date',
	    '[object Function]': 'function',
	    '[object Number]': 'number',
	    '[object RegExp]': 'regexp',
	    '[object String]': 'string'
	};

	function type(obj) {
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
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = toNumber;

	var numIsFinite = Number.isFinite || function(value) {
	    return typeof value === 'number' && isFinite(value);
	};

	function toNumber(value, options) {
	    return _toNumber(options, value);
	}

	toNumber.configure = function(options) {
	    return _toNumber.bind(undefined, options);
	};

	function _toNumber(options, value) {
	    if (numIsFinite(value)) {
	        return value;
	    }

	    var decimalSeparator = options && options.decimalSeparator || '.';

	    var string = '' + value;

	    var dotPos = string.indexOf('.');
	    var commaPos = string.indexOf(',');

	    if (commaPos > -1) {
	        if (dotPos > -1 && commaPos > dotPos) {
	            decimalSeparator = ',';
	        } else if (dotPos === -1) {
	            var decimalLength = string.substr(commaPos + 1).length;
	            if (decimalLength > 0 && decimalLength < 3) {
	                decimalSeparator = ',';
	            }
	        }
	    }

	    if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
	        decimalSeparator = ',';
	    } else if (dotPos === -1 && commaPos > -1 && string.substr(commaPos + 1).length < 3) {
	        decimalSeparator = ',';
	    }

	    var regex = new RegExp("[^0-9-" + decimalSeparator + "]", ["g"]);

	    return parseFloat(
	        string
	            .replace(/\(([^-]+)\)/, "-$1") // replace bracketed values with negatives
	            .replace(regex, '') // strip out any cruft
	            .replace(decimalSeparator, '.') // make sure decimal separator is standard
	    ) || 0;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = options;

	var extend = __webpack_require__(2);
	var type = __webpack_require__(4);

	function options(options, key, value) {
	    if (arguments.length === 1) {
	        return extend(true, {}, options);
	    }

	    if (type(key) === 'string') {
	        if (type(value) === 'undefined') {
	            return type(options[key]) === 'undefined' ? null : options[key];
	        }

	        options[key] = value;
	    } else {
	        extend(options, key);
	    }

	    return this;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = value;

	var type = __webpack_require__(4);

	function value(value, context, args) {
	    if (type(value) === 'function') {
	        return value.apply(context, args || []);
	    }

	    return value;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatCurrency;

	var extend = __webpack_require__(2);
	var defaultCurrencies = __webpack_require__(9);
	var formatNumber = __webpack_require__(10);

	function formatCurrency(value, options) {
	    return _formatCurrency(options, value);
	}

	formatCurrency.configure = function(options) {
	    return _formatCurrency.bind(undefined, options);
	};

	function _formatCurrency(options, value) {
	    options = options || {};

	    var currency = options.currency;
	    var currencies = options.currencies || defaultCurrencies;
	    var currencyOpts = currencies[currency] || {suffix: currency ? ' ' + currency : ''};

	    var opts = extend(
	        {precision: 2},
	        currencyOpts,
	        options
	    );

	    return formatNumber(value, opts);
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    AED: { prefix: '\u062c' },
	    ANG: { prefix: '\u0192' },
	    ARS: { prefix: '$', suffix: ' ARS' },
	    AUD: { prefix: '$', suffix: ' AUD' },
	    AWG: { prefix: '\u0192' },
	    BBD: { prefix: '$', suffix: ' BBD' },
	    BGN: { prefix: '\u043b\u0432' },
	    BTC: { suffix: ' BTC', precision: 4 },
	    BMD: { prefix: '$', suffix: ' BMD' },
	    BND: { prefix: '$', suffix: ' BND' },
	    BRL: { prefix: 'R$' },
	    BSD: { prefix: '$', suffix: ' BSD' },
	    CAD: { prefix: '$', suffix: ' CAD' },
	    CHF: { suffix: ' CHF' },
	    CLP: { prefix: '$', suffix: ' CLP' },
	    CNY: { prefix: '\u00A5' },
	    COP: { prefix: '$', suffix: ' COP' },
	    CRC: { prefix: '\u20A1' },
	    CZK: { prefix: 'Kc' },
	    DKK: { prefix: 'kr' },
	    DOP: { prefix: '$', suffix: ' DOP' },
	    EEK: { prefix: 'kr' },
	    EUR: { prefix: '\u20AC' },
	    GBP: { prefix: '\u00A3' },
	    GTQ: { prefix: 'Q' },
	    HKD: { prefix: '$', suffix: ' HKD' },
	    HRK: { prefix: 'kn' },
	    HUF: { prefix: 'Ft' },
	    IDR: { prefix: 'Rp' },
	    ILS: { prefix: '\u20AA' },
	    INR: { prefix: 'Rs.' },
	    ISK: { prefix: 'kr' },
	    JMD: { prefix: 'J$' },
	    JPY: { prefix: '\u00A5', precision: 0 },
	    KRW: { prefix: '\u20A9' },
	    KYD: { prefix: '$', suffix: ' KYD' },
	    LTL: { prefix: 'Lt' },
	    LVL: { prefix: 'Ls' },
	    MXN: { prefix: '$', suffix: ' MXN' },
	    MYR: { prefix: 'RM' },
	    NOK: { prefix: 'kr' },
	    NZD: { prefix: '$', suffix: ' NZD' },
	    PEN: { prefix: 'S/' },
	    PHP: { prefix: 'Php' },
	    PLN: { prefix: 'z' },
	    QAR: { prefix: '\ufdfc' },
	    RON: { prefix: 'lei' },
	    RUB: { prefix: '\u0440\u0443\u0431' },
	    SAR: { prefix: '\ufdfc' },
	    SEK: { prefix: 'kr' },
	    SGD: { prefix: '$', suffix: ' SGD' },
	    THB: { prefix: '\u0E3F' },
	    TRY: { prefix: 'TL' },
	    TTD: { prefix: 'TT$' },
	    TWD: { prefix: 'NT$' },
	    UAH: { prefix: '\u20b4' },
	    USD: { prefix: '$' },
	    UYU: { prefix: '$U' },
	    VEF: { prefix: 'Bs' },
	    VND: { prefix: '\u20ab' },
	    XCD: { prefix: '$', suffix: ' XCD' },
	    ZAR: { prefix: 'R' }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatNumber;

	var toNumber = __webpack_require__(5);
	var toFixed = __webpack_require__(11);
	var type = __webpack_require__(4);

	function formatNumber(value, options) {
	    return _formatNumber(options, value);
	}

	formatNumber.configure = function(options) {
	    return _formatNumber.bind(undefined, options);
	};

	function _formatNumber(options, value) {
	    var number = toNumber(value);

	    options = options || {};

	    var isNeg = (number < 0),
	        output = number + '',
	        precision = options.precision,
	        decSep = options.decimalSeparator || '.',
	        groupSep = options.groupingSeparator,
	        groupSize = type(options.groupingSize) === 'number' ? options.groupingSize : 3,
	        decIndex,
	        newOutput, count, i;

	    // Decimal precision
	    if (type(precision) === 'number') {
	        // Round to the correct decimal place
	        output = toFixed(number, precision);
	    }

	    // Decimal separator
	    if (decSep !== '.') {
	        output = output.replace('.', decSep);
	    }

	    // Add the grouping separator
	    if (groupSep) {
	        // Find the dot or where it would be
	        decIndex = output.lastIndexOf(decSep);
	        decIndex = (decIndex > -1) ? decIndex : output.length;
	        // Start with the dot and everything to the right
	        newOutput = output.substring(decIndex);
	        // Working left, every third time add a separator, every time add a digit
	        for (count = 0, i = decIndex; i > 0; i--) {
	            if ((count % groupSize === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
	                newOutput = groupSep + newOutput;
	            }
	            newOutput = output.charAt(i - 1) + newOutput;
	            count++;
	        }
	        output = newOutput;
	    }

	    return (options.prefix || '') + output + (options.suffix || '');
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = toFixed;

	function toFixed(value, precision, options) {
	    return _toFixed(options, value, precision);
	}

	toFixed.configure = function(options) {
	    return _toFixed.bind(undefined, options);
	};

	function _toFixed(options, value, precision) {
	    var roundingFunction = options && options.roundingFunction || Math.round;
	    var power = Math.pow(10, precision || 0);

	    return (roundingFunction(value * power) / power).toFixed(precision);
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = storageLocalStorage;

	function storageLocalStorage(namespace, localStorage) {
	    namespace = namespace || 'carty';
	    localStorage = localStorage || window.localStorage;

	    function save(item, cart) {
	        console.log(cart.items)
	        localStorage.setItem(namespace, JSON.stringify(cart.items()));
	    }

	    function empty() {
	        localStorage.removeItem(namespace);
	    }

	    return {
	        load: function() {
	            try {
	                return JSON.parse(localStorage.getItem(namespace));
	            } catch (e) {
	                return []
	            }
	        },
	        put: save,
	        remove: save,
	        clear: empty,
	        checkout: empty
	    };
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = uiJquery;

	var $ = __webpack_require__(14);

	var _defaultOptions = {
	    namespace: 'carty',
	    numberFormatter: function(number) {
	        return number;
	    },
	    currencyFormatter: function(number) {
	        return number;
	    }
	};

	var _inputSelector = 'input,select,textarea';
	var _dataAttrPrefixLength = 'data-'.length;

	function uiJquery(cart, options) {
	    var _options = $.extend({}, _defaultOptions, options);

	    function dataKey(prop) {
	        return _options.namespace + '-' + prop;
	    }

	    function dataAttr(prop) {
	        return 'data-' + dataKey(prop);
	    }

	    function dataSelector(prop) {
	        return '[' + dataAttr(prop) + ']';
	    }

	    var _itemSelector = dataSelector('item');
	    var _itemDataKey = dataKey('item');
	    var _itemDataAttrPrefix = dataAttr('item-');
	    var _itemVariantDataAttr = dataAttr('item-variant');
	    var _itemVariantDataAttrPrefix = dataAttr('item-variant-');

	    var _addDataKey = dataKey('add');
	    var _addSelector = dataSelector('add');
	    var _addButtonSelector = dataSelector('add') + ':not(' + _inputSelector + ')';
	    var _addInputSelector = dataSelector('add') + _inputSelector;
	    var _updateDataKey = dataKey('update');
	    var _updateSelector = dataSelector('update');
	    var _updateButtonSelector = dataSelector('update') + ':not(' + _inputSelector + ')';
	    var _updateInputSelector = dataSelector('update') + _inputSelector;
	    var _removeSelector = dataSelector('remove');
	    var _removeDataKey = dataKey('remove');
	    var _clearSelector = dataSelector('clear');

	    function ensureObject(data) {
	        return $.type(data) !== 'object' ? {} : data;
	    }

	    function setValue(el, value) {
	        el
	            .filter(_inputSelector)
	            .val(value)
	            .end()
	            .filter('a')
	            .attr('href', value)
	            .end()
	            .filter('img')
	            .attr('src', value)
	            .end()
	            .not(_inputSelector)
	            .not('img')
	            .not('a')
	            .text(value)
	        ;
	    }

	    function getValue(el, dataKey) {
	        return el.data(dataKey) // data- attribute
	            || el.val() // form element
	            || el.attr('href') // <a> element
	            || el.attr('src') // <img> element
	            || $.trim(el.text()) // html container element
	            || null;
	    }

	    function collectItemData(el, elData) {
	        var itemEl = el;

	        var itemData = {};
	        var itemVariants = {};
	        var itemVariantsFound = false;

	        function extract() {
	            var el = $(this);

	            if (el.is(':checkbox,:radio') && !el.is(':checked')) {
	                return;
	            }

	            $.each(this.attributes, function() {
	                if (this.name.indexOf(_itemDataAttrPrefix) < 0) {
	                    return;
	                }

	                var name = el.attr('name');
	                var val  = getValue(el, this.name.substr(_dataAttrPrefixLength));

	                if (this.name.indexOf(_itemVariantDataAttr) > -1) {
	                    if (name || this.name.indexOf(_itemVariantDataAttrPrefix) >= 0) {
	                        itemVariants[name || this.name.substr(_itemVariantDataAttrPrefix.length)] = val;
	                    } else {
	                        $.extend(itemVariants, val);
	                    }

	                    itemVariantsFound = true;
	                } else {
	                    itemData[name || this.name.substr(_itemDataAttrPrefix.length)] = val;
	                }
	            });
	        }

	        if (!itemEl.is(_itemSelector)) {
	            itemEl = el.closest(_itemSelector);
	        }

	        itemEl.each(extract);
	        itemEl.find('*').each(extract);

	        if (itemVariantsFound) {
	            $.extend(itemData, {variant: itemVariants});
	        }

	        elData = ensureObject(elData);

	        if (el.is(_inputSelector)) {
	            var name = el.attr('name');

	            if (name) {
	                elData[name] = el.val();
	            }
	        }

	        return $.extend(
	            itemData,
	            ensureObject(itemEl.data(_itemDataKey)),
	            elData
	        );
	    }

	    // ---

	    var addHandler = function(e) {
	        var el = $(e.target);

	        if (el.is(_addSelector)) {
	            cart.add(collectItemData(el, el.data(_addDataKey)));
	        }
	    };

	    var updateHandler = function(e) {
	        var el = $(e.target);

	        if (el.is(_updateSelector)) {
	            cart.update(collectItemData(el, el.data(_updateDataKey)));
	        }
	    };

	    $(document)
	        .on('click', _addButtonSelector, addHandler)
	        .on('change', _addInputSelector, addHandler)
	        .on('click', _updateButtonSelector, updateHandler)
	        .on('change', _updateInputSelector, updateHandler)
	        .on('click', _removeSelector, function(e) {
	            var el = $(e.target);

	            if (el.is(_removeSelector)) {
	                cart.remove(collectItemData(el, el.data(_removeDataKey)));
	            }
	        })
	        .on('click', _clearSelector, function() {
	            cart.clear()
	        })
	    ;

	    // ---

	    function update() {
	        $.each([
	            'size',
	            'quantity'
	        ], function (i, prop) {
	            setValue(
	                $(dataSelector(prop)),
	                _options.numberFormatter(cart[prop]())
	            );
	        });

	        $.each([
	            'subtotal',
	            'shipping',
	            'tax',
	            'total'
	        ], function (i, prop) {
	            setValue(
	                $(dataSelector(prop)),
	                _options.currencyFormatter(cart[prop]())
	            );
	        });
	    }

	    $(function() {
	        cart.ready(function() {
	            update();
	            cart.on('changed', update);
	        });
	    });

	    return update;
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }
/******/ ])
});
;