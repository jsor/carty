/*!
 * Carty - v0.1.0 - 2015-03-16
 * http://sorgalla.com/carty/
 * Copyright (c) 2015 Jan Sorgalla; Licensed MIT
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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

	module.exports = carty;

	var $ = __webpack_require__(1);
	var currencies = __webpack_require__(2);
	var createCart = __webpack_require__(3);
	var createLocalStorageStorage = __webpack_require__(4);
	var createJqueryUi = __webpack_require__(5);

	var jqueryUi = createJqueryUi(window.document, $);

	var _defaultOptions = {
	    namespace: 'carty',
	    currencies: currencies
	};

	function carty(options) {
	    var _options = $.extend({}, _defaultOptions, options);
	    _options.storage = _options.storage || createLocalStorageStorage(window.localStorage, _options.namespace);

	    var cart = createCart(_options);

	    cart.ui = jqueryUi(cart, _options);

	    return cart;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createCart;

	var extend = __webpack_require__(14);
	var emitter = __webpack_require__(6);
	var parseNumber = __webpack_require__(7);
	var options = __webpack_require__(8);
	var value = __webpack_require__(9);
	var createItem = __webpack_require__(10);

	var resolve = Promise.resolve.bind(Promise);
	var reject = Promise.reject.bind(Promise);

	var _defaultOptions = {
	    storage: null,
	    currency: 'USD',
	    shipping: null,
	    tax: null
	};

	function createCart(opts) {
	    var _options = extend({}, _defaultOptions, opts);
	    var _items = [];
	    var _ready = load();

	    function cart() {
	        return _items.slice(0);
	    }

	    var emit = emitter(cart);

	    cart.ready = function(onReady) {
	        ready(onReady);

	        return cart;
	    };

	    cart.error = function(onError) {
	        error(onError);

	        return cart;
	    };

	    cart.options = options.bind(cart, _options);

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
	            return false !== callback.call(context, item, index, cart);
	        });

	        return cart;
	    };

	    cart.quantity = function() {
	        return cart().reduce(function(previous, item) {
	            return previous + item.quantity();
	        }, 0);
	    };

	    cart.subtotal = function() {
	        return cart().reduce(function(previous, item) {
	            return previous + (item.price() * item.quantity());
	        }, 0);
	    };

	    cart.shipping = function() {
	        if (!cart.size()) {
	            return 0;
	        }

	        return parseNumber(value(_options.shipping, undefined, [cart]), _options);
	    };

	    cart.tax = function() {
	        if (!cart.size()) {
	            return 0;
	        }

	        return parseNumber(value(_options.tax, undefined, [cart]), _options);
	    };

	    cart.total = function() {
	        return cart.subtotal() + cart.tax() + cart.shipping();
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
	            if (Array.isArray(items)) {
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

	    function update(attr) {
	        var item = createItem(attr);

	        if (!emit('update', item)) {
	            return;
	        }

	        var existing = has(item);

	        if (!existing) {
	            return;
	        }

	        item = createItem(extend({}, existing.item(), item()));

	        if (item.quantity() < 1) {
	            return remove(item);
	        }

	        _items[existing.index] = item;

	        return resolve(
	            _options.storage && _options.storage.update(item, cart)
	        ).then(emit.bind(cart, 'updated', item), function(e) {
	            emit('updatefailed', e, item);
	            return reject(e);
	        });
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
	            _options.storage && _options.storage.add(item, cart)
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
	            _options.storage && _options.storage.remove(existing.item, cart)
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
	            _options.storage && _options.storage.clear()
	        ).then(emit.bind(cart, 'cleared'), function(e) {
	            emit('clearfailed', e);
	            return reject(e);
	        });
	    }

	    return cart;
	}

	createCart.options = options.bind(createCart, _defaultOptions);
	createCart.item = createItem;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createLocalStorageStorage;

	function createLocalStorageStorage(localStorage, namespace) {
	    namespace = namespace || 'carty';

	    function save(item, cart) {
	        var data = cart().map(function(item) {
	            return item();
	        });

	        localStorage.setItem(namespace, JSON.stringify(data));
	    }

	    return {
	        load: function() {
	            try {
	                return JSON.parse(localStorage.getItem(namespace));
	            } catch (e) {
	                return []
	            }
	        },
	        add: save,
	        update: save,
	        remove: save,
	        clear: function() {
	            localStorage.removeItem(namespace);
	        }
	    };
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createJqueryUi;

	var formatCurrency = __webpack_require__(11);
	var formatNumber = __webpack_require__(12);
	var template = __webpack_require__(13);

	var _defaultOptions = {
	    namespace: 'carty'
	};

	var _inputSelector = 'input,select,textarea';
	var _dataAttrPrefixLength = 'data-'.length;

	function createJqueryUi(document, $) {
	    function jqueryUi(cart, options) {
	        var _options = $.extend({}, _defaultOptions, options);

	        if (!_options.currencyFormatter) {
	            _options.currencyFormatter = formatCurrency.configure(_options);
	        }

	        if (!_options.numberFormatter) {
	            _options.numberFormatter = formatNumber.configure(_options);
	        }

	        if (!_options.templateLoader) {
	            _options.templateLoader = function jqueryTemplateLoader(selector) {
	                return $(selector).html();
	            };
	        }

	        var _template = template(_options);

	        var _updateCallbacks = [];
	        var _checkoutCallbacks = [];

	        function dataKey(prop) {
	            return _options.namespace + '-' + prop;
	        }

	        function dataAttr(prop) {
	            return 'data-' + dataKey(prop);
	        }

	        function dataSelector(prop) {
	            return '[' + dataAttr(prop) + ']';
	        }

	        var _cartSelector = dataSelector('cart');
	        var _cartAttr = dataKey('cart');

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
	        var _checkoutSelector = dataSelector('checkout');

	        function normalizeData(data) {
	            return !data ? {} : ($.type(data) === 'string' ? {id: data} : data);
	        }

	        function setValue(el, value) {
	            el
	                .filter(_inputSelector)
	                .val(value)
	                .end()
	                .filter('img')
	                .attr('src', value)
	                .end()
	                .not(_inputSelector)
	                .not('img')
	                .text(value)
	            ;
	        }

	        function getValue(el, dataKey) {
	            return el.data(dataKey) // data- attribute
	                || el.val() // form element
	                || $.trim(el.text()) // html container element
	                || el.attr('src') // <img> element
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

	            itemEl.each(extract);

	            if (!itemEl.is(_itemSelector)) {
	                itemEl = el.closest(_itemSelector);
	            }

	            itemEl.find('*').each(extract);

	            if (itemVariantsFound) {
	                $.extend(itemData, {variant: itemVariants});
	            }

	            elData = normalizeData(elData);

	            if (el.is(_inputSelector)) {
	                var name = el.attr('name');

	                if (name) {
	                    elData[name] = el.val();
	                }
	            }

	            return $.extend(
	                itemData,
	                normalizeData(itemEl.data(_itemDataKey)),
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
	            .on('click', _checkoutSelector, function() {
	                cart.ready(function() {
	                    $.each(_checkoutCallbacks, function(i, callback) {
	                        callback(cart);
	                    });
	                });
	            })
	        ;

	        // ---

	        function update() {
	            $.each(_updateCallbacks, function(i, callback) {
	                callback(cart);
	            });

	            $.each([
	                'size',
	                'quantity',
	                'subtotal',
	                'shipping',
	                'tax',
	                'total'
	            ], function (i, prop) {
	                setValue(
	                    $(dataSelector(prop)),
	                    cart[prop]()
	                );
	            });

	            $(_cartSelector)
	                .each(function() {
	                    var el = $(this);
	                    el.empty().append(_template(el.data(_cartAttr), cart));
	                })
	            ;
	        }

	        update.notify = function(callback) {
	            _updateCallbacks.push(callback);

	            return update;
	        };

	        update.checkout = function(callback) {
	            _checkoutCallbacks.push(callback);

	            return update;
	        };

	        $(function() {
	            cart.ready(function() {
	                update();
	                cart.on(['added', 'updated', 'removed', 'cleared'], update);
	            });
	        });

	        return update;
	    }

	    return jqueryUi;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = emitter;

	var isArray = Array.isArray;

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
	        var args = [].slice.call(arguments, 1),
	            passed = true;

	        if (isArray(event)) {
	            event.forEach(function(evt) {
	                if (false === emit.apply(object, [evt].concat(args))) {
	                    passed = false;
	                }
	            });

	            return passed;
	        }

	        var callbacks = _callbacks['$' + event];

	        if (callbacks) {
	            callbacks = callbacks.slice(0);

	            for (var i = 0, len = callbacks.length; i < len; ++i) {
	                if (false === callbacks[i].apply(object, args)) {
	                    passed = false;
	                }
	            }
	        }

	        return passed;
	    };
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = parseNumber;

	function parseNumber(value, options) {
	    return _parseNumber(options, value);
	}

	parseNumber.configure = function(options) {
	    return _parseNumber.bind(undefined, options);
	};

	function _parseNumber(options, value) {
	    var float = parseFloat(value);

	    if (isFinite(float)) {
	        return float;
	    }

	    options = options || {};

	    var decimalSeparator = options && options.decimalSeparator;

	    var string = '' + value;

	    if (!decimalSeparator) {
	        var dotPos = string.indexOf('.');
	        var commaPos = string.indexOf(',');

	        decimalSeparator = '.';

	        if (dotPos > -1 && commaPos > -1 && commaPos > dotPos) {
	            decimalSeparator = ',';
	        }
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = options;

	var extend = __webpack_require__(14);
	var type = __webpack_require__(15);

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = value;

	var type = __webpack_require__(15);

	function value(value, context, args) {
	    if (type(value) === 'function') {
	        return value.apply(context, args || []);
	    }

	    return value;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createItem;

	var extend = __webpack_require__(14);
	var parseNumber = __webpack_require__(7);
	var type = __webpack_require__(15);

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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatCurrency;

	var extend = __webpack_require__(14);
	var formatNumber = __webpack_require__(12);

	function formatCurrency(value, options) {
	    return _formatCurrency(options, value);
	}

	formatCurrency.configure = function(options) {
	    return _formatCurrency.bind(undefined, options);
	};

	function _formatCurrency(options, value) {
	    options= options || {};

	    var currencies = options.currencies || {};
	    var currency = options.currency;

	    options = extend({}, {precision: 2}, currencies[currency] || {suffix: currency ? ' ' + currency : ''}, options);

	    return formatNumber(value, options);
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatNumber;

	var parseNumber = __webpack_require__(7);
	var type = __webpack_require__(15);

	function formatNumber(value, options) {
	    return _formatNumber(options, value);
	}

	formatNumber.configure = function(options) {
	    return _formatNumber.bind(undefined, options);
	};

	function _formatNumber(options, value) {
	    var number = parseNumber(value);

	    options = options || {};

	    var isNeg = (number < 0),
	        output = number + '',
	        precision = options.precision,
	        decSep = options.decimalSeparator || '.',
	        thouSep = options.thousandsSeparator,
	        decIndex,
	        newOutput, count, i;

	    // Decimal precision
	    if (type(precision) === 'number' && precision >= 0 && precision <= 20) {
	        // Round to the correct decimal place
	        output = number.toFixed(precision);
	    }

	    // Decimal separator
	    if (decSep !== '.') {
	        output = output.replace('.', decSep);
	    }

	    // Add the thousands separator
	    if (thouSep) {
	        // Find the dot or where it would be
	        decIndex = output.lastIndexOf(decSep);
	        decIndex = (decIndex > -1) ? decIndex : output.length;
	        // Start with the dot and everything to the right
	        newOutput = output.substring(decIndex);
	        // Working left, every third time add a separator, every time add a digit
	        for (count = 0, i = decIndex; i > 0; i--) {
	            if ((count % 3 === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
	                newOutput = thouSep + newOutput;
	            }
	            newOutput = output.charAt(i - 1) + newOutput;
	            count++;
	        }
	        output = newOutput;
	    }

	    return (options.prefix || '') + output + (options.suffix || '');
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createTemplate;

	var extend = __webpack_require__(14);

	var _defaultOptions = {
	    templateLoader: function(template) {
	        return template;
	    },
	    currencyFormatter: function(value) {
	        return value;
	    },
	    numberFormatter: function(value) {
	        return value;
	    }
	};

	function createTemplate(options) {
	    var _options = extend(true, {}, _defaultOptions, options);
	    var formatNumber = _options.numberFormatter;
	    var formatCurrency = _options.currencyFormatter;

	    /*
	     * JavaScript Templates 2.4.1
	     * https://github.com/blueimp/JavaScript-Templates
	     *
	     * Copyright 2011, Sebastian Tschan
	     * https://blueimp.net
	     */
	    var tmpl = function(str, data) {
	        var f = !/[^\w\-\.:#]/.test(str) ? tmpl.cache[str] = tmpl.cache[str] ||
	            tmpl(tmpl.load(str)) :
	                new Function(
	                    tmpl.arg + ',tmpl,formatNumber,formatCurrency',
	                    "var _e=tmpl.encode" + tmpl.helper + ",_s='" +
	                        str.replace(tmpl.regexp, tmpl.func) +
	                        "';return _s;"
	                );
	        return data ? f(data, tmpl, formatNumber, formatCurrency) : function(data) {
	            return f(data, tmpl, formatNumber, formatCurrency);
	        };
	    };
	    tmpl.cache = {};
	    tmpl.load = _options.templateLoader;
	    tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
	    tmpl.func = function(s, p1, p2, p3, p4, p5) {
	        if (p1) { // whitespace, quote and backspace in HTML context
	            return {
	                    "\n": "\\n",
	                    "\r": "\\r",
	                    "\t": "\\t",
	                    " ": " "
	                }[p1] || "\\" + p1;
	        }
	        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
	            if (p2 === "=") {
	                return "'+_e(" + p3 + ")+'";
	            }
	            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
	        }
	        if (p4) { // evaluation start tag: {%
	            return "';";
	        }
	        if (p5) { // evaluation end tag: %}
	            return "_s+='";
	        }
	    };
	    tmpl.encReg = /[<>&"'\x00]/g;
	    tmpl.encMap = {
	        "<": "&lt;",
	        ">": "&gt;",
	        "&": "&amp;",
	        "\"": "&quot;",
	        "'": "&#39;"
	    };
	    tmpl.encode = function(s) {
	        /*jshint eqnull:true */
	        return (s == null ? "" : "" + s).replace(
	            tmpl.encReg,
	            function(c) {
	                return tmpl.encMap[c] || "";
	            }
	        );
	    };
	    tmpl.arg = "cart";
	    tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
	        ",include=function(s,d){_s+=tmpl(s,d);}";

	    return tmpl;
	}


/***/ },
/* 14 */
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



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ }
/******/ ])
});
;