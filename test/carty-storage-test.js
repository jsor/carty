var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().options('storage')", function() {
    var storage, mock;

    beforeEach(function() {
        storage = {
            load: function () { return {items: [{id: 'Existing Item'}] }; },
            put: function (item, items) { },
            remove: function (item, items) { },
            clear: function () { },
            checkout: function () { }
        };

        mock = sinon.mock(storage)
    });

    it("can load non-array data", function(done) {
        mock.expects('load').once().returns(null);

        carty({storage: storage})
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 0);
                assert.strictEqual(cart().items.length, 0);

                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("loads items from storage", function(done) {
        mock.expects('load').once().returns({items: [{id: 'id'}] });

        carty({storage: storage})
            .ready(function(cart) {
                assert.strictEqual(cart.size(), 1);
                assert.strictEqual(cart().items.length, 1);

                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("puts items to storage", function(done) {
        mock.expects('put').twice();

        carty({storage: storage})
            .add('Item')
            .update('Item')
            .ready(function() {
                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("propagates add error", function(done) {
        mock.expects('put').once().returns(Promise.reject('error'));

        carty({storage: storage})
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
            })
            .error(function() {
                process.nextTick(function() {
                    assert.fail();
                    done();
                }, 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("removes items from storage", function(done) {
        mock.expects('remove').once();

        carty({storage: storage})
            .remove('Existing Item')
            .ready(function() {
                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("propagates remove error returned as Promise", function(done) {
        mock.expects('remove').once().returns(Promise.reject('error'));

        carty({storage: storage})
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
            })
            .error(function() {
                process.nextTick(function() {
                    assert.fail();
                    done();
                }, 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("propagates thrown remove error", function(done) {
        var exception = new Error('error');
        mock.expects('remove').once().throws(exception);

        carty({storage: storage})
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
            })
            .error(function() {
                process.nextTick(function() {
                    assert.fail();
                    done();
                }, 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("clears storage", function(done) {
        mock.expects('clear').once();

        carty({storage: storage})
            .clear()
            .ready(function() {
                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calls checkout with data", function(done) {
        var data = {key: 'value'};

        mock.expects('checkout').once().withArgs(data);

        carty({storage: storage})
            .checkout(data)
            .ready(function() {
                mock.verify();
            })
            .ready(function() {
                done();
            })
        ;
    });
});
