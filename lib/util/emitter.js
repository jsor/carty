'use strict';

module.exports = emitter;

var type = require('./type');

function isArray(value) {
    return type(value) === 'array';
}

// Adapted from component-emitter
function emitter(object) {
    var _callbacks = {};

    object.on = function(event, fn) {
        if (isArray(event)) {
            event.forEach(function(evt) {
                object.on(evt, fn);
            });
        } else {
            (_callbacks['$' + event] = _callbacks['$' + event] || [])
                .push(fn);
        }

        return object;
    };

    object.once = function(event, fn) {
        if (isArray(event)) {
            event.forEach(function(evt) {
                object.once(evt, fn);
            });

            return object;
        }

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

        if (isArray(event)) {
            event.forEach(function(evt) {
                object.off(evt, fn);
            });

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
        var args = [].slice.call(arguments, 1), ret;

        if (isArray(event)) {
            return Promise.all(event.map(function(evt) {
                return emit.apply(object, [evt].concat(args));
            }));
        }

        var callbacks = _callbacks['$' + event];

        if (!callbacks) {
            return Promise.resolve();
        }

        return Promise.all(callbacks.slice(0).map(function(callback) {
            ret = callback.apply(object, args);

            if (false === ret) {
                return Promise.reject();
            }

            return ret;
        }));
    };
}
