/*!
 * Carty - v0.1.0 - 2015-03-10
 * http://sorgalla.com/carty/
 * Copyright (c) 2015 Jan Sorgalla; Licensed MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jquery"] = factory(require("jquery"));
	else
		root["carty"] = root["carty"] || {}, root["carty"]["ui"] = root["carty"]["ui"] || {}, root["carty"]["ui"]["jquery"] = factory(root["jQuery"]);
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

	var $ = __webpack_require__(1);

	module.exports = function cartyViewJquery(cart) {
	    function data(el, prop) {
	        return el.data('carty-' + prop);
	    }

	    function dataPrefix(prop) {
	        return 'data-carty-' + prop;
	    }

	    function dataAttr(prop) {
	        return '[' + dataPrefix(prop) + ']';
	    }

	    function updateElement(i, prop) {
	        $(dataAttr(prop.toLowerCase())).html(cart[prop]());
	    }

	    function update() {
	        $.each([
	            'quantity',
	            'total',
	            'shipping',
	            'tax',
	            'grandTotal'
	        ], updateElement);
	    }

	    cart.on(['added', 'removed', 'cleared'], update);
	    $(update);

	    function extractItem(el) {
	        var itemEl = el,
	            itemDataAttr = dataAttr('item')
	        ;

	        if (!itemEl.is(itemDataAttr)) {
	            itemEl = el.find(itemDataAttr);

	            if (!itemEl.length) {
	                itemEl = el.closest(itemDataAttr);
	            }
	        }

	        var itemAttrPrefix = dataPrefix('item-'),
	            itemVariantPrefix = dataPrefix('item-variant-'),
	            itemAttr = {},
	            itemVariants = {}
	        ;

	        itemEl.find('*').each(function() {
	            var el = $(this);

	            $.each(this.attributes, function() {
	                if (this.name.indexOf(itemAttrPrefix) < 0) {
	                    return;
	                }

	                var val =  $.trim(this.value) || $.trim(el.val()) || $.trim(el.text());

	                if (this.name.indexOf(itemVariantPrefix) < 0) {
	                    itemAttr[this.name.substr(itemAttrPrefix.length)] = val;
	                } else {
	                    itemVariants[this.name.substr(itemVariantPrefix.length)] = val;
	                }
	            });
	        });

	        var itemData = data(itemEl, 'item');

	        if ($.type(itemData) === 'string') {
	            itemData = {id: itemData};
	        }

	        return $.extend(itemAttr, {variant: itemVariants}, itemData);
	    }

	    var dataAttrAdd = dataAttr('add');
	    var dataAttrRemove = dataAttr('remove');

	    $(document)
	        .on('click', dataAttrAdd, function(e) {
	            var el = $(e.target);

	            if (el.is(dataAttrAdd)) {
	                cart.add(extractItem(el));
	            }
	        })
	        .on('click', dataAttrRemove, function() {
	            var el = $(e.target);

	            if (el.is(dataAttrRemove)) {
	                cart.remove(extractItem(el));
	            }
	        })
	        .on('click', dataAttr('clear'), function() {
	            cart.clear()
	        })
	    ;

	    return update;
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;