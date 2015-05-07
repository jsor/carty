var should = require('chai').should();
var assert = require('chai').assert;
var emitter = require('../../lib/util/emitter');

var throwUncaught = function(e) {
    setTimeout(function() { throw e; });
};

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
        it('returns rejected promise if a listener returns false', function(done) {
            obj.on('foo', function() {
                return true;
            });

            obj.on('foo', function() {
                return false;
            });

            emit('foo', 1)
                .then(
                    function() {
                        assert.fail();
                    },
                    function() {
                        assert.ok(true);
                    }
                )
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('returns rejected promise if listeners as array return false', function(done) {
            obj.on('foo', function(val) {
                return true;
            });

            obj.on('bar', function(val) {
                return false;
            });

            emit(['foo', 'bar'], 1)
                .then(
                    function() {
                        assert.fail();
                    },
                    function() {
                        assert.ok(true);
                    }
                )
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('triggers events as array', function(done) {
            var num = 0;

            obj.on('foo', function(val) {
                num += val;
            });

            obj.on('bar', function(val) {
                num += val;
            });

            emit(['foo', 'bar'], 1)
                .then(function() {
                    num.should.eql(2);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });
    });

    describe('.on(event, fn)', function() {
        it('adds listeners', function(done) {
            var calls = [];

            obj.on('foo', function(val) {
                calls.push('one', val);
            });

            obj.on('foo', function(val) {
                calls.push('two', val);
            });

            Promise
                .all([
                    emit('foo', 1),
                    emit('bar', 1),
                    emit('foo', 2)
                ])
                .then(function() {
                    calls.should.eql(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('adds listeners for events which are same names with methods of Object.prototype', function(done) {
            var calls = [];

            obj.on('constructor', function(val) {
                calls.push('one', val);
            });

            obj.on('__proto__', function(val) {
                calls.push('two', val);
            });

            Promise
                .all([
                    emit('constructor', 1),
                    emit('__proto__', 2)
                ])
                .then(function() {
                    calls.should.eql(['one', 1, 'two', 2]);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('adds listeners as array', function(done) {
            var num = 0;

            obj.on(['foo', 'bar'], function(val) {
                num += val;
            });

            Promise
                .all([
                    emit('foo', 1),
                    emit('bar', 1)
                ])
                .then(function() {
                    num.should.eql(2);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });
    });

    describe('.once(event, fn)', function() {
        it('adds a single-shot listener', function(done) {
            var calls = [];

            obj.once('foo', function(val) {
                calls.push('one', val);
            });

            Promise
                .all([
                    emit('foo', 1),
                    emit('foo', 2),
                    emit('foo', 3),
                    emit('bar', 1)
                ])
                .then(function() {
                    calls.should.eql(['one', 1]);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('adds a single-shot listeners as array', function(done) {
            var num = 0;

            obj.once(['foo', 'bar'], function(val) {
                num += val;
            });

            Promise
                .all([
                    emit('foo', 1),
                    emit('bar', 1),

                    emit('foo', 1),
                    emit('bar', 1)
                ])
                .then(function() {
                    num.should.eql(2);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });
    });

    describe('.off(event, fn)', function() {
        it('removes a listener', function(done) {
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

            emit('foo')
                .then(function() {
                    calls.should.eql(['one']);
                })
                .then(function() {
                    done();
                }, throwUncaught);
        });

        it('removes listeners as array', function(done) {
            var num = 0;

            function cb(val) {
                num += val;
            }

            obj.on('foo', cb);
            obj.on('bar', cb);
            obj.off(['foo', 'bar'], cb);

            Promise
                .all([
                    emit('foo', 1),
                    emit('bar', 1)
                ])
                .then(function() {
                    num.should.eql(0);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('works with .once()', function(done) {
            var calls = [];

            function one() {
                calls.push('one');
            }

            obj.once('foo', one);
            obj.once('fee', one);
            obj.off('foo', one);

            emit('foo')
                .then(function() {
                    calls.should.eql([]);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('works when called from an event', function(done) {
            var called;

            function b() {
                called = true;
            }

            obj.on('tobi', function() {
                obj.off('tobi', b);
            });
            obj.on('tobi', b);

            emit('tobi')
                .then(function() {
                    called.should.be.true;
                })
                .then(function() {
                    called = false;
                    return emit('tobi');
                })
                .then(function() {
                    called.should.be.false;
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('returns with no listeners', function() {
            var returnValue = obj.off('foo');
            returnValue.should.equal(obj);
        });
    });

    describe('.off(event)', function() {
        it('removes all listeners for an event', function(done) {
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

            Promise
                .all([
                    emit('foo'),
                    emit('foo')
                ])
                .then(function() {
                    calls.should.eql([]);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        });

        it('removes all listeners as array for an event', function(done) {
            var num = 0;

            function cb(val) {
                num += val;
            }

            obj.on('foo', cb);
            obj.on('bar', cb);
            obj.off(['foo', 'bar']);

            Promise
                .all([
                    emit('foo', 1),
                    emit('bar', 1)
                ])
                .then(function() {
                    num.should.eql(0);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        })
    });

    describe('.off()', function() {
        it('removes all listeners', function(done) {
            var calls = [];

            function one() {
                calls.push('one');
            }

            function two() {
                calls.push('two');
            }

            obj.on('foo', one);
            obj.on('bar', two);

            Promise
                .all([
                    emit('foo'),
                    emit('bar')
                ])
                .then(function() {
                    obj.off();
                })
                .then(function() {
                    return Promise
                        .all([
                            emit('foo'),
                            emit('bar')
                        ])
                    ;
                })
                .then(function() {
                    calls.should.eql(['one', 'two']);
                })
                .then(function() {
                    done();
                }, throwUncaught)
            ;
        })
    });
});
