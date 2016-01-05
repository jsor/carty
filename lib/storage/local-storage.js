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
        put: save,
        remove: save,
        clear: function() {
            localStorage.removeItem(namespace);
        }
    };
}
