'use strict';

module.exports = (function(window, JSON) {
    return function localeStorageStore(namespace, localStorage) {
        namespace = namespace || 'carty';
        localStorage = localStorage || window.localStorage;

        function save(item, cart) {
            var data = cart().map(function(item) {
                return item();
            });

            localStorage.setItem(namespace, JSON.stringify(data));
        }

        return {
            enabled: function() {
                return !!localStorage;
            },
            load: function() {
                try {
                    return JSON.parse(localStorage.getItem(namespace));
                } catch (e) {
                    return []
                }
            },
            add: save,
            remove: save,
            clear: function() {
                localStorage.removeItem(namespace);
            }
        };
    };
})(typeof window !== 'undefined' ? window : this, JSON);
