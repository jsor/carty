'use strict';

module.exports = storageLocalStorage;

function storageLocalStorage(namespace, localStorage) {
    namespace = namespace || 'carty';
    localStorage = localStorage || window.localStorage;

    function save(item, cart) {
        console.log(cart.items)
        localStorage.setItem(namespace, JSON.stringify(cart.items()));
    }

    function empty() {
        localStorage.removeItem(namespace);
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
        clear: empty,
        checkout: empty
    };
}
