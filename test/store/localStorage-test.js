var assert = require('chai').assert;
var sinon = require('sinon');
var localStorage = require('../../store/localStorage');
var createItem = typeof window !== 'undefined' ? window.carty.item : require('../../item');

describe("storage/localStorage()", function() {
    var mockLocalStorage = {
        setItem: function (data, done) { },
        getItem: function (done) { },
        removeItem: function (done) { }
    }, mock;

    beforeEach(function() {
        mock = sinon.mock(mockLocalStorage)
    });

    it("is enabled", function() {
        var storage = localStorage(null, mockLocalStorage);

        assert.isTrue(storage.enabled());
    });

    it("is not enabled", function() {
        var storage = localStorage();

        assert.isFalse(storage.enabled());
    });

    it("adds data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.add(null, function() { return [createItem('Item')]; });

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

    it("clears store", function() {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.clear();

        mock.verify();
    });
});
