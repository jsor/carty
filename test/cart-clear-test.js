var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().clear()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
        instance.add({id: 'Item'});
        instance.add({id: 'Item2'});
    });

    it("removes all items", function(done) {
        instance
            .clear()
            .ready(function() {
                assert.strictEqual(instance.size(), 0);

                var count = 0;
                instance.each(function() {
                    count++;
                });

                assert.strictEqual(count, 0);

                assert.strictEqual(instance().length, 0);
                done();
            })
        ;
    });

    it("emits clear event", function(done) {
        instance.on('clear', function() {
            done();
        });

        instance.clear();
    });

    it("aborts if clear event listener returns false", function(done) {
        instance.on('clear', function() {
            return false;
        });

        instance
            .clear()
            .ready(function() {
                assert.strictEqual(instance.size(), 2);
                done();
            })
        ;
    });

    it("emits cleared event", function(done) {
        instance.on('cleared', function() {
            done();
        });

        instance.clear();
    });

    it("emits clearfailed event", function(done) {
        instance = cart({
            store: {
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
