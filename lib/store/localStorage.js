'use strict';

var JSON = typeof window !== 'undefined' ? window.JSON : JSON;
var localStorage = typeof window !== 'undefined' ? window.localStorage : (function() {
    throw 'localStorage is only available in the browser';
})();

module.exports = function localeStorageStore(namespace) {
    return {
        set: function(data) {
            localStorage.setItem(namespace, JSON.stringify(data));
        },
        get: function() {
            try {
                return JSON.parse(localStorage.getItem(namespace)) || [];
            } catch (e) {
                return [];
            }
        },
        clear: function() {
            localStorage.removeItem(namespace);
        }
    };
};
