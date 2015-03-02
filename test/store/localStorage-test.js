var assert = require('chai').assert;
var sinon = require('sinon');
var localStorage = require('../../store/localStorage');

describe("storage/localStorage()", function() {
    var mockLocalStorageData = null, mockLocalStorage = {
        setItem: function (data) { mockLocalStorageData = data },
        getItem: function () { return mockLocalStorageData; },
        removeItem: function () { mockLocalStorageData = null }
    }, mock;

    beforeEach(function() {
        mock = sinon.mock(mockLocalStorage)
    });

    it("is enabled", function() {
        var storage = localStorage(null, mockLocalStorage);

        assert(storage.enabled());
    });

    it("saves data", function() {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.save(['Item']);

        mock.verify();
    });

    it("loads data", function() {
        mock.expects('getItem').once().returns('[]');

        var storage = localStorage(null, mockLocalStorage);

        storage.load();

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

        storage.load();

        mock.verify();
    });

    it("clears store", function() {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.clear();

        mock.verify();
    });
});
