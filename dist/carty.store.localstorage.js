(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.carty||(g.carty = {}));g=(g.store||(g.store = {}));g.localStorage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = (function(window, JSON) {
    return function localeStorageStore(namespace, localStorage) {
        namespace = namespace || 'carty';
        localStorage = localStorage || window.localStorage;

        return {
            enabled: function() {
                return !!localStorage;
            },
            save: function(data, done) {
                localStorage.setItem(namespace, JSON.stringify(data));
                done();
            },
            load: function(done) {
                var data = [];

                try {
                    data = JSON.parse(localStorage.getItem(namespace));
                } catch (e) {
                }

                done(data);
            },
            clear: function(done) {
                localStorage.removeItem(namespace);
                done();
            }
        };
    };
})(typeof window !== 'undefined' ? window : this, JSON);

},{}]},{},[1])(1)
});