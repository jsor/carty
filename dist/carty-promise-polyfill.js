/*!
 * Carty - v0.1.0 - 2015-03-18
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
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

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9).polyfill();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var carty = __webpack_require__(3);

	carty.format = {
	    currency: __webpack_require__(4),
	    number: __webpack_require__(5)
	};

	carty.storage = {
	    localStorage: __webpack_require__(6)
	};

	carty.ui = {
	    jquery: __webpack_require__(7)
	};

	module.exports = carty;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = carty;

	var extend = __webpack_require__(18);
	var emitter = __webpack_require__(10);
	var toNumber = __webpack_require__(11);
	var options = __webpack_require__(12);
	var value = __webpack_require__(13);
	var createItem = __webpack_require__(14);

	var resolve = Promise.resolve.bind(Promise);
	var reject = Promise.reject.bind(Promise);

	var _defaultOptions = {
	    storage: null,
	    shipping: null,
	    tax: null
	};

	function carty(opts) {
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

	    cart.on(['add', 'update', 'remove', 'clear'], function() {
	        emit('change');
	    });

	    cart.on(['added', 'updated', 'removed', 'cleared'], function() {
	        emit('changed');
	    });

	    cart.on(['addfailed', 'updatefailed', 'removefailed', 'clearfailed'], function() {
	        emit('changefailed');
	    });

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
	        if (!emit('update', attr)) {
	            return;
	        }

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
	        });
	    }

	    function add(attr) {
	        if (!emit('add', attr)) {
	            return;
	        }

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
	        });
	    }

	    function remove(attr) {
	        if (!emit('remove', attr)) {
	            return;
	        }

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

	carty.options = options.bind(carty, _defaultOptions);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatCurrency;

	var extend = __webpack_require__(18);
	var defaultCurrencies = __webpack_require__(15);
	var formatNumber = __webpack_require__(5);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = formatNumber;

	var toNumber = __webpack_require__(11);
	var toFixed = __webpack_require__(16);
	var type = __webpack_require__(17);

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
	        thouSep = options.thousandsSeparator,
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = storageLocalStorage;

	function storageLocalStorage(namespace, localStorage) {
	    namespace = namespace || 'carty';
	    localStorage = localStorage || window.localStorage;

	    function save(item, cart) {
	        localStorage.setItem(namespace, JSON.stringify(cart().items));
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = uiJquery;

	var $ = __webpack_require__(8);
	var formatCurrency = __webpack_require__(4);
	var formatNumber = __webpack_require__(5);

	var _defaultOptions = {
	    namespace: 'carty'
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

	    function normalizeData(data) {
	        return !data ? {} : ($.type(data) === 'string' ? {id: data} : data);
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
	    ;

	    // ---

	    function update() {
	        $.each([
	            'size',
	            'quantity'
	        ], function (i, prop) {
	            setValue(
	                $(dataSelector(prop)),
	                formatNumber(cart[prop](), _options)
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
	                formatCurrency(cart[prop](), _options)
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.0.1
	 */

	(function() {
	    "use strict";

	    function $$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function $$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function $$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var $$utils$$_isArray;

	    if (!Array.isArray) {
	      $$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      $$utils$$_isArray = Array.isArray;
	    }

	    var $$utils$$isArray = $$utils$$_isArray;
	    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
	    function $$utils$$F() { }

	    var $$utils$$o_create = (Object.create || function (o) {
	      if (arguments.length > 1) {
	        throw new Error('Second argument not supported');
	      }
	      if (typeof o !== 'object') {
	        throw new TypeError('Argument must be an object');
	      }
	      $$utils$$F.prototype = o;
	      return new $$utils$$F();
	    });

	    var $$asap$$len = 0;

	    var $$asap$$default = function asap(callback, arg) {
	      $$asap$$queue[$$asap$$len] = callback;
	      $$asap$$queue[$$asap$$len + 1] = arg;
	      $$asap$$len += 2;
	      if ($$asap$$len === 2) {
	        // If len is 1, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        $$asap$$scheduleFlush();
	      }
	    };

	    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
	    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

	    // test for web worker but not in IE10
	    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function $$asap$$useNextTick() {
	      return function() {
	        process.nextTick($$asap$$flush);
	      };
	    }

	    function $$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function $$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = $$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function $$asap$$useSetTimeout() {
	      return function() {
	        setTimeout($$asap$$flush, 1);
	      };
	    }

	    var $$asap$$queue = new Array(1000);

	    function $$asap$$flush() {
	      for (var i = 0; i < $$asap$$len; i+=2) {
	        var callback = $$asap$$queue[i];
	        var arg = $$asap$$queue[i+1];

	        callback(arg);

	        $$asap$$queue[i] = undefined;
	        $$asap$$queue[i+1] = undefined;
	      }

	      $$asap$$len = 0;
	    }

	    var $$asap$$scheduleFlush;

	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      $$asap$$scheduleFlush = $$asap$$useNextTick();
	    } else if ($$asap$$BrowserMutationObserver) {
	      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
	    } else if ($$asap$$isWorker) {
	      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
	    } else {
	      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
	    }

	    function $$$internal$$noop() {}
	    var $$$internal$$PENDING   = void 0;
	    var $$$internal$$FULFILLED = 1;
	    var $$$internal$$REJECTED  = 2;
	    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

	    function $$$internal$$selfFullfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function $$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.')
	    }

	    function $$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        $$$internal$$GET_THEN_ERROR.error = error;
	        return $$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function $$$internal$$handleForeignThenable(promise, thenable, then) {
	       $$asap$$default(function(promise) {
	        var sealed = false;
	        var error = $$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            $$$internal$$resolve(promise, value);
	          } else {
	            $$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          $$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          $$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function $$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === $$$internal$$FULFILLED) {
	        $$$internal$$fulfill(promise, thenable._result);
	      } else if (promise._state === $$$internal$$REJECTED) {
	        $$$internal$$reject(promise, thenable._result);
	      } else {
	        $$$internal$$subscribe(thenable, undefined, function(value) {
	          $$$internal$$resolve(promise, value);
	        }, function(reason) {
	          $$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        $$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = $$$internal$$getThen(maybeThenable);

	        if (then === $$$internal$$GET_THEN_ERROR) {
	          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          $$$internal$$fulfill(promise, maybeThenable);
	        } else if ($$utils$$isFunction(then)) {
	          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          $$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function $$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
	      } else if ($$utils$$objectOrFunction(value)) {
	        $$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        $$$internal$$fulfill(promise, value);
	      }
	    }

	    function $$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      $$$internal$$publish(promise);
	    }

	    function $$$internal$$fulfill(promise, value) {
	      if (promise._state !== $$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = $$$internal$$FULFILLED;

	      if (promise._subscribers.length === 0) {
	      } else {
	        $$asap$$default($$$internal$$publish, promise);
	      }
	    }

	    function $$$internal$$reject(promise, reason) {
	      if (promise._state !== $$$internal$$PENDING) { return; }
	      promise._state = $$$internal$$REJECTED;
	      promise._result = reason;

	      $$asap$$default($$$internal$$publishRejection, promise);
	    }

	    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + $$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        $$asap$$default($$$internal$$publish, parent);
	      }
	    }

	    function $$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          $$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function $$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

	    function $$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        $$$internal$$TRY_CATCH_ERROR.error = e;
	        return $$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = $$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = $$$internal$$tryCatch(callback, detail);

	        if (value === $$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== $$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        $$$internal$$resolve(promise, value);
	      } else if (failed) {
	        $$$internal$$reject(promise, error);
	      } else if (settled === $$$internal$$FULFILLED) {
	        $$$internal$$fulfill(promise, value);
	      } else if (settled === $$$internal$$REJECTED) {
	        $$$internal$$reject(promise, value);
	      }
	    }

	    function $$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          $$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          $$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        $$$internal$$reject(promise, e);
	      }
	    }

	    function $$$enumerator$$makeSettledResult(state, position, value) {
	      if (state === $$$internal$$FULFILLED) {
	        return {
	          state: 'fulfilled',
	          value: value
	        };
	      } else {
	        return {
	          state: 'rejected',
	          reason: value
	        };
	      }
	    }

	    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor($$$internal$$noop, label);
	      this._abortOnReject = abortOnReject;

	      if (this._validateInput(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;

	        this._init();

	        if (this.length === 0) {
	          $$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            $$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        $$$internal$$reject(this.promise, this._validationError());
	      }
	    }

	    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return $$utils$$isArray(input);
	    };

	    $$$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };

	    $$$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };

	    var $$$enumerator$$default = $$$enumerator$$Enumerator;

	    $$$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var promise = this.promise;
	      var input   = this._input;

	      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };

	    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      if ($$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
	          entry._onerror = null;
	          this._settledAt(entry._state, i, entry._result);
	        } else {
	          this._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        this._remaining--;
	        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
	      }
	    };

	    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;

	      if (promise._state === $$$internal$$PENDING) {
	        this._remaining--;

	        if (this._abortOnReject && state === $$$internal$$REJECTED) {
	          $$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = this._makeResult(state, i, value);
	        }
	      }

	      if (this._remaining === 0) {
	        $$$internal$$fulfill(promise, this._result);
	      }
	    };

	    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
	      return value;
	    };

	    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      $$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt($$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt($$$internal$$REJECTED, i, reason);
	      });
	    };

	    var $$promise$all$$default = function all(entries, label) {
	      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
	    };

	    var $$promise$race$$default = function race(entries, label) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      var promise = new Constructor($$$internal$$noop, label);

	      if (!$$utils$$isArray(entries)) {
	        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }

	      var length = entries.length;

	      function onFulfillment(value) {
	        $$$internal$$resolve(promise, value);
	      }

	      function onRejection(reason) {
	        $$$internal$$reject(promise, reason);
	      }

	      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
	        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }

	      return promise;
	    };

	    var $$promise$resolve$$default = function resolve(object, label) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor($$$internal$$noop, label);
	      $$$internal$$resolve(promise, object);
	      return promise;
	    };

	    var $$promise$reject$$default = function reject(reason, label) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor($$$internal$$noop, label);
	      $$$internal$$reject(promise, reason);
	      return promise;
	    };

	    var $$es6$promise$promise$$counter = 0;

	    function $$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function $$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise’s eventual value or the reason
	      why the promise cannot be fulfilled.

	      Terminology
	      -----------

	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.

	      A promise can be in one of three states: pending, fulfilled, or rejected.

	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.

	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.


	      Basic Usage:
	      ------------

	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);

	        // on failure
	        reject(reason);
	      });

	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Advanced Usage:
	      ---------------

	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.

	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();

	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();

	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }

	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Unlike callbacks, promises are great composable primitives.

	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON

	        return values;
	      });
	      ```

	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function $$es6$promise$promise$$Promise(resolver) {
	      this._id = $$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];

	      if ($$$internal$$noop !== resolver) {
	        if (!$$utils$$isFunction(resolver)) {
	          $$es6$promise$promise$$needsResolver();
	        }

	        if (!(this instanceof $$es6$promise$promise$$Promise)) {
	          $$es6$promise$promise$$needsNew();
	        }

	        $$$internal$$initializePromise(this, resolver);
	      }
	    }

	    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
	    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
	    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
	    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

	    $$es6$promise$promise$$Promise.prototype = {
	      constructor: $$es6$promise$promise$$Promise,

	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.

	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```

	      Chaining
	      --------

	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.

	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });

	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```

	      Assimilation
	      ------------

	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```

	      If the assimliated promise rejects, then the downstream promise will also reject.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```

	      Simple Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var result;

	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```

	      Advanced Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var author, books;

	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js

	      function foundBooks(books) {

	      }

	      function failure(reason) {

	      }

	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: function(onFulfillment, onRejection) {
	        var parent = this;
	        var state = parent._state;

	        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
	          return this;
	        }

	        var child = new this.constructor($$$internal$$noop);
	        var result = parent._result;

	        if (state) {
	          var callback = arguments[state - 1];
	          $$asap$$default(function(){
	            $$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	        }

	        return child;
	      },

	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.

	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }

	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }

	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };

	    var $$es6$promise$polyfill$$default = function polyfill() {
	      var local;

	      if (typeof global !== 'undefined') {
	        local = global;
	      } else if (typeof window !== 'undefined' && window.document) {
	        local = window;
	      } else {
	        local = self;
	      }

	      var es6PromiseSupport =
	        "Promise" in local &&
	        // Some of these methods are missing from
	        // Firefox/Chrome experimental implementations
	        "resolve" in local.Promise &&
	        "reject" in local.Promise &&
	        "all" in local.Promise &&
	        "race" in local.Promise &&
	        // Older version of the spec had a resolver object
	        // as the arg rather than a function
	        (function() {
	          var resolve;
	          new local.Promise(function(r) { resolve = r; });
	          return $$utils$$isFunction(resolve);
	        }());

	      if (!es6PromiseSupport) {
	        local.Promise = $$es6$promise$promise$$default;
	      }
	    };

	    var es6$promise$umd$$ES6Promise = {
	      'Promise': $$es6$promise$promise$$default,
	      'polyfill': $$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(20)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
	    }
	}).call(this);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), (function() { return this; }()), __webpack_require__(21)(module)))

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = options;

	var extend = __webpack_require__(18);
	var type = __webpack_require__(17);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = value;

	var type = __webpack_require__(17);

	function value(value, context, args) {
	    if (type(value) === 'function') {
	        return value.apply(context, args || []);
	    }

	    return value;
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createItem;

	var extend = __webpack_require__(18);
	var toNumber = __webpack_require__(11);
	var type = __webpack_require__(17);

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


/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

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
/* 17 */
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


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
;