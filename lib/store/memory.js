'use strict';

module.exports = function memoryStore(/* namespace */) {
    var _data = [];

    return {
        set: function(data) {
            _data = data;
        },
        get: function() {
            return _data;
        },
        clear: function() {
            _data = [];
        }
    };
};
