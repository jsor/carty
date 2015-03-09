'use strict';

// Adapted from component-emitter
module.exports = function emitter(object) {
    var _callbacks = {};

    object.on = function(event, fn) {
        (_callbacks['$' + event] = _callbacks['$' + event] || [])
            .push(fn);

        return object;
    };

    object.once = function(event, fn) {
        function on() {
            object.off(event, on);
            fn.apply(object, arguments);
        }

        on.fn = fn;
        object.on(event, on);

        return object;
    };

    object.off = function(event, fn) {
        if (0 == arguments.length) {
            _callbacks = {};
            return object;
        }

        var callbacks = _callbacks['$' + event];

        if (!callbacks) {
            return object;
        }

        if (1 == arguments.length) {
            delete _callbacks['$' + event];
            return object;
        }

        var cb;

        for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }

        return object;
    };

    return function emit(event) {
        var args = [].slice.call(arguments, 1),
            callbacks = _callbacks['$' + event],
            passed = true
        ;

        if (callbacks) {
            callbacks = callbacks.slice(0);

            for (var i = 0, len = callbacks.length; i < len; ++i) {
                if (!callbacks[i].apply(object, args)) {
                    passed = false;
                }
            }
        }

        return passed;
    };
};
