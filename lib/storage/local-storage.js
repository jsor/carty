'use strict';

module.exports = createLocalStorageStorage;

function createLocalStorageStorage(localStorage, namespace) {
    namespace = namespace || 'carty';

    function save(item, cart) {
        var data = cart().map(function(item) {
            return item();
        });

        localStorage.setItem(namespace, JSON.stringify(data));
    }

    return {
        load: function() {
            try {
                return JSON.parse(localStorage.getItem(namespace));
            } catch (e) {
                return []
            }
        },
        add: save,
        update: save,
        remove: save,
        clear: function() {
            localStorage.removeItem(namespace);
        }
    };
}
