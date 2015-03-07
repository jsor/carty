/*!
 * Carty - v0.1.0 - 2015-03-07
 * http://sorgalla.com/carty/
 * Copyright (c) 2015 Jan Sorgalla; Licensed MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["cartyStoreLocalStorage"] = factory();
	else
		root["cartyStoreLocalStorage"] = factory();
})(this, function() {
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

	module.exports = function localeStorageStore(namespace, localStorage) {
	    namespace = namespace || 'carty';
	    localStorage = localStorage || (window && window.localStorage);

	    function save(item, cart) {
	        var data = cart().map(function(item) {
	            return item();
	        });

	        localStorage && localStorage.setItem(namespace, JSON.stringify(data));
	    }

	    return {
	        load: function() {
	            try {
	                return JSON.parse(localStorage && localStorage.getItem(namespace));
	            } catch (e) {
	                return []
	            }
	        },
	        add: save,
	        remove: save,
	        clear: function() {
	            localStorage && localStorage.removeItem(namespace);
	        }
	    };
	};


/***/ }
/******/ ])
});
;