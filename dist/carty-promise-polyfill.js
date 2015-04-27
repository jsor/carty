/*!
 * Carty - v0.1.0 - 2015-04-27
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_9__) {
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

	__webpack_require__(2);
	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, setImmediate, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.1.1
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$toString = {}.toString;
	    var lib$es6$promise$asap$$vertxNext;
	    function lib$es6$promise$asap$$asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        lib$es6$promise$asap$$scheduleFlush();
	      }
	    }

	    var lib$es6$promise$asap$$default = lib$es6$promise$asap$$asap;

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      var nextTick = process.nextTick;
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // setImmediate should be used instead instead
	      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
	      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
	        nextTick = setImmediate;
	      }
	      return function() {
	        nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertex() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(8);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFullfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$default(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      var enumerator = this;

	      enumerator._instanceConstructor = Constructor;
	      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (enumerator._validateInput(input)) {
	        enumerator._input     = input;
	        enumerator.length     = input.length;
	        enumerator._remaining = input.length;

	        enumerator._init();

	        if (enumerator.length === 0) {
	          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	        } else {
	          enumerator.length = enumerator.length || 0;
	          enumerator._enumerate();
	          if (enumerator._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
	      }
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return lib$es6$promise$utils$$isArray(input);
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };

	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var enumerator = this;

	      var length  = enumerator.length;
	      var promise = enumerator.promise;
	      var input   = enumerator._input;

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        enumerator._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var enumerator = this;
	      var c = enumerator._instanceConstructor;

	      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
	          entry._onerror = null;
	          enumerator._settledAt(entry._state, i, entry._result);
	        } else {
	          enumerator._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        enumerator._remaining--;
	        enumerator._result[i] = entry;
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var enumerator = this;
	      var promise = enumerator.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        enumerator._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          enumerator._result[i] = value;
	        }
	      }

	      if (enumerator._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }

	      var length = entries.length;

	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }

	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }

	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

	    var lib$es6$promise$promise$$counter = 0;

	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
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
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        if (!lib$es6$promise$utils$$isFunction(resolver)) {
	          lib$es6$promise$promise$$needsResolver();
	        }

	        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
	          lib$es6$promise$promise$$needsNew();
	        }

	        lib$es6$promise$$internal$$initializePromise(this, resolver);
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

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

	        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	          return this;
	        }

	        var child = new this.constructor(lib$es6$promise$$internal$$noop);
	        var result = parent._result;

	        if (state) {
	          var callback = arguments[state - 1];
	          lib$es6$promise$asap$$default(function(){
	            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
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
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }

	      var P = local.Promise;

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(20)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18), __webpack_require__(19).setImmediate, (function() { return this; }()), __webpack_require__(21)(module)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = carty;

	var extend = __webpack_require__(22);
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

	var extend = __webpack_require__(22);
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

	var $ = __webpack_require__(9);
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

	/* (ignored) */

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

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

	var extend = __webpack_require__(22);
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

	var extend = __webpack_require__(22);
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(18).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19).setImmediate, __webpack_require__(19).clearImmediate))

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


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var undefined;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		'use strict';
		if (!obj || toStr.call(obj) !== '[object Object]') {
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
/******/ ])
});
;