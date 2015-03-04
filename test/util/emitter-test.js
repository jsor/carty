var should = require('chai').should();
var assert = require('chai').assert;
var emitter = require('../../util/emitter');

// Adapted from component-emitter
describe("util/emitter()", function() {
    var obj, emit;

    beforeEach(function() {
        obj = {};
        emit = emitter(obj);
    });

    it("object does not expose the emit() method", function() {
        assert.isUndefined(obj.emit);
    });

    describe('emit()', function() {
        it('returns false if a listener returns false', function() {
            obj.on('foo', function(val) {
                return true;
            });

            obj.on('foo', function(val) {
                return false;
            });

            var result = emit('foo', 1);

            result.should.be.false;
        });
    });

    describe('emit()', function() {
        it('returns false if a listener returns false', function() {
            obj.on('foo', function(val) {
                return true;
            });

            obj.on('foo', function(val) {
                return false;
            });

            var result = emit('foo', 1);

            result.should.be.false;
        });
    });

    describe('.on(event, fn)', function() {
        it('adds listeners', function() {
            var calls = [];

            obj.on('foo', function(val) {
                calls.push('one', val);
            });

            obj.on('foo', function(val) {
                calls.push('two', val);
            });

            emit('foo', 1);
            emit('bar', 1);
            emit('foo', 2);

            calls.should.eql(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
        });

        it('adds listeners for events which are same names with methods of Object.prototype', function() {
            var calls = [];

            obj.on('constructor', function(val) {
                calls.push('one', val);
            });

            obj.on('__proto__', function(val) {
                calls.push('two', val);
            });

            emit('constructor', 1);
            emit('__proto__', 2);

            calls.should.eql(['one', 1, 'two', 2]);
        });
    });

    describe('.once(event, fn)', function() {
        it('adds a single-shot listener', function() {
            var calls = [];

            obj.once('foo', function(val) {
                calls.push('one', val);
            });

            emit('foo', 1);
            emit('foo', 2);
            emit('foo', 3);
            emit('bar', 1);

            calls.should.eql(['one', 1]);
        })
    });

    describe('.off(event, fn)', function() {
        it('removes a listener', function() {
            var calls = [];

            function one() {
                calls.push('one');
            }

            function two() {
                calls.push('two');
            }

            obj.on('foo', one);
            obj.on('foo', two);
            obj.off('foo', two);

            emit('foo');

            calls.should.eql(['one']);
        });

        it('works with .once()', function() {
            var calls = [];

            function one() {
                calls.push('one');
            }

            obj.once('foo', one);
            obj.once('fee', one);
            obj.off('foo', one);

            emit('foo');

            calls.should.eql([]);
        });

        it('works when called from an event', function() {
            var called;

            function b() {
                called = true;
            }

            obj.on('tobi', function() {
                obj.off('tobi', b);
            });
            obj.on('tobi', b);
            emit('tobi');
            called.should.be.true;
            called = false;
            emit('tobi');
            called.should.be.false;
        });

        it('returns with no listeners', function() {
            var returnValue = obj.off('foo');
            returnValue.should.equal(obj);
        });
    });

    describe('.off(event)', function() {
        it('removes all listeners for an event', function() {
            var calls = [];

            function one() {
                calls.push('one');
            }

            function two() {
                calls.push('two');
            }

            obj.on('foo', one);
            obj.on('foo', two);
            obj.off('foo');

            emit('foo');
            emit('foo');

            calls.should.eql([]);
        })
    });

    describe('.off()', function() {
        it('removes all listeners', function() {
            var calls = [];

            function one() {
                calls.push('one');
            }

            function two() {
                calls.push('two');
            }

            obj.on('foo', one);
            obj.on('bar', two);

            emit('foo');
            emit('bar');

            obj.off();

            emit('foo');
            emit('bar');

            calls.should.eql(['one', 'two']);
        })
    });
});
