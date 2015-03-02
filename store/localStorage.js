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
