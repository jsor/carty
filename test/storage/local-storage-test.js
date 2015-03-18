var assert = require('chai').assert;
var sinon = require('sinon');
var localStorage = require('../../lib/storage/local-storage');
var createItem = typeof window !== 'undefined' ? window.carty.item : require('../../lib/item');

describe("storage/localStorage(null, )", function() {
    var mockLocalStorage = {
        setItem: function (data, done) { },
        getItem: function (done) { },
        removeItem: function (done) { }
    }, mock;

    beforeEach(function() {
        mock = sinon.mock(mockLocalStorage)
    });

    it("works with window.localStorage", function() {
        global.window = {
            localStorage: mockLocalStorage
        };
        mock.expects('setItem').once();

        var storage = localStorage();

        storage.add(null, function() { return [createItem('Item')]; });

        mock.verify();

        delete global.window;
    });

    it("adds data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.add(null, function() { return [createItem('Item')]; });

        mock.verify();
    });

    it("updates data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.update(null, function() { return [createItem('Item')]; });

        mock.verify();
    });

    it("removes data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.remove(null, function() { return [createItem('Item')]; });

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

    it("clears storage", function() {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.clear();

        mock.verify();
    });
});
