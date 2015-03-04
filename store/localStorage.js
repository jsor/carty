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
