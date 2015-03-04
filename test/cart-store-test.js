var assert = require('chai').assert;
var sinon = require('sinon');
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart()._options.store", function() {
    var store = {
        enabled: function() { return true; },
        save: function (data) { },
        load: function () { return []; },
        clear: function () {}
    }, mock;

    beforeEach(function() {
        mock = sinon.mock(store)
    });

    it("saves items to store", function(done) {
        mock.expects('save').twice();

        cart({store: store})
            .add('Item')
            .add('Item2')
            .ready(function() {
                mock.verify();
                done();
            })
        ;
    });

    it("propagates save error", function(done) {
        mock.expects('save').once().returns(Promise.reject('error'));

        cart({store: store})
            .add('Item')
            .error(function(error) {
                assert.strictEqual(error, 'error');

                return Promise.reject(error);
            })
            .error(function(error) {
                assert.strictEqual(error, 'error');
            })
            .ready(function(error) {
                assert.notStrictEqual(error, 'error');
                mock.verify();
                done();
            })
            .error(function() {
                process.nextTick(function() {
                    assert.fail();
                    done();
                }, 10);
            })
        ;
    });

    it("emits save event", function(done) {
        var instance = cart({store: store});

        instance.on('save', function() {
            done();
        });

        instance.add('Item');
    });

    it("emits saved event", function(done) {
        var instance = cart({store: store});

        instance.on('saved', function() {
            done();
        });

        instance.add('Item');
    });

    it("emits saved event without store", function(done) {
        var instance = cart();

        instance.on('saved', function() {
            done();
        });

        instance.add('Item');
    });


    it("emits savefailed event", function(done) {
        instance = cart({
            store: {
                enabled: function() { return true; },
                load: function() { return []; },
                save: function() { return Promise.reject('error'); }
            }
        });

        instance.on('savefailed', function(error) {
            assert.strictEqual(error, 'error')
            done();
        });

        instance.add('Item');
    });

    it("loads items from store", function(done) {
        mock.expects('load').once().returns([{id: 'id'}]);

        cart({store: store})
            .ready(function(instance) {
                assert.strictEqual(1, instance.size());
                assert.strictEqual(1, instance().length);

                mock.verify();

                done();
            });
    });

    it("clears store", function(done) {
        mock.expects('clear').once();

        cart({store: store})
            .clear()
            .ready(function() {
                mock.verify();

                done();
            });
    });

    it("emits clear event", function(done) {
        var instance = cart({store: store});

        instance.on('clear', function() {
            done();
        });

        instance.clear();
    });

    it("emits cleared event", function(done) {
        var instance = cart({store: store});

        instance.on('cleared', function() {
            done();
        });

        instance.clear();
    });

    it("emits cleared event without store", function(done) {
        var instance = cart();

        instance.on('cleared', function() {
            done();
        });

        instance.clear();
    });

    it("emits clearfailed event", function(done) {
        var instance = cart({
            store: {
                enabled: function() { return true; },
                load: function() { return []; },
                clear: function() { return Promise.reject('error'); }
            }
        });

        instance.on('clearfailed', function(error) {
            assert.strictEqual(error, 'error')
            done();
        });

        instance.clear();
    });
});
