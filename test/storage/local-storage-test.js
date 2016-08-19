var assert = require('chai').assert;
var sinon = require('sinon');
var localStorage = require('../../lib/storage/local-storage');
var carty = typeof window !== 'undefined' ? window.carty : require('../../lib/carty');

describe("storage/localStorage(null, )", function() {
    var mockLocalStorage = {
        setItem: function (data, done) { },
        getItem: function (done) { },
        removeItem: function (done) { }
    }, mock;

    var cart;

    beforeEach(function() {
        mock = sinon.mock(mockLocalStorage);
        cart = carty();
    });

    it("works with window.localStorage", function() {
        global.window = {
            localStorage: mockLocalStorage
        };
        mock.expects('setItem').once();

        var storage = localStorage();

        storage.put(null, function() { return [cart.item('Item')]; });

        mock.verify();

        delete global.window;
    });

    it("puts data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.put(null, function() { return [cart.item('Item')]; });

        mock.verify();
    });

    it("removes data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.remove(null, function() { return [cart.item('Item')]; });

        mock.verify();
    });

    it("loads data", function() {
        mock.expects('getItem').once().returns('["test"]');

        var storage = localStorage(null, mockLocalStorage);

        var data = storage.load();

        assert.isArray(data);
        assert.deepEqual(data, ['test']);

        mock.verify();
    });

    it("loads invalid data", function() {
        mock.expects('getItem').once().returns('foo');

        var storage = localStorage(null, mockLocalStorage);

        storage.load();

        mock.verify();
    });

    it("loads when storage throws", function() {
        mock.expects('getItem').once().throws('foo');

        var storage = localStorage(null, mockLocalStorage);

        storage.load(function() {});

        mock.verify();
    });

    it("empties storage on clear", function() {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.clear();

        mock.verify();
    });

    it("empties storage on checkout", function() {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.checkout();

        mock.verify();
    });
});
