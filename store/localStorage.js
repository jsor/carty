'use strict';

module.exports = (function(window, JSON) {
    return function localeStorageStore(namespace, localStorage) {
        namespace = namespace || 'carty';
        localStorage = localStorage || window.localStorage;

        return {
            enabled: function() {
                return !!localStorage;
            },
            save: function(data) {
                localStorage.setItem(namespace, JSON.stringify(data));
            },
            load: function() {
                try {
                    return JSON.parse(localStorage.getItem(namespace));
                } catch (e) {
                    return [];
                }
            },
            clear: function() {
                localStorage.removeItem(namespace);
            }
        };
    };
})(typeof window !== 'undefined' ? window : this, JSON);
