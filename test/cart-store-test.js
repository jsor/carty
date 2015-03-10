var assert = require('chai').assert;
var sinon = require('sinon');
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().option('store')", function() {
    var store, mock;

    beforeEach(function() {
        store = {
            load: function () { return [{id: 'Existing Item'}]; },
            add: function (item, items) { },
            remove: function (item, items) { },
            clear: function () {}
        };

        mock = sinon.mock(store)
    });

    it("can load non-array data", function(done) {
        mock.expects('load').once().returns(null);

        cart({store: store})
            .ready(function(instance) {
                assert.strictEqual(0, instance.size());
                assert.strictEqual(0, instance().length);

                mock.verify();

                done();
            });
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

    it("adds items to store", function(done) {
        mock.expects('add').twice();

        cart({store: store})
            .add('Item')
            .add('Item2')
            .ready(function() {
                mock.verify();
                done();
            })
        ;
    });

    it("propagates add error", function(done) {
        mock.expects('add').once().returns(Promise.reject('error'));

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

    it("removes items from store", function(done) {
        mock.expects('remove').once();

        cart({store: store})
            .remove('Existing Item')
            .ready(function() {
                mock.verify();
                done();
            })
        ;
    });

    it("propagates remove error returned as Promise", function(done) {
        mock.expects('remove').once().returns(Promise.reject('error'));

        cart({store: store})
            .remove('Existing Item')
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

    it("propagates thrown remove error", function(done) {
        var exception = new Error('error');
        mock.expects('remove').once().throws(exception);

        cart({store: store})
            .remove('Existing Item')
            .error(function(error) {
                assert.strictEqual(error, exception);

                return Promise.reject(error);
            })
            .error(function(error) {
                assert.strictEqual(error, exception);
            })
            .ready(function(error) {
                assert.notStrictEqual(error, exception);
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

    it("clears store", function(done) {
        mock.expects('clear').once();

        cart({store: store})
            .clear()
            .ready(function() {
                mock.verify();

                done();
            });
    });
});
