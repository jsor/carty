var assert = require('chai').assert;
var sinon = require('sinon');
var localStorage = require('../../store/localStorage');

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

        assert(storage.enabled());
    });

    it("is not enabled", function() {
        var storage = localStorage();

        assert.isFalse(storage.enabled());
    });

    it("saves data", function(done) {
        mock.expects('setItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.save(['Item'], function() {
            mock.verify();
            done();
        });
    });

    it("loads data", function(done) {
        mock.expects('getItem').once().returns('["test"]');

        var storage = localStorage(null, mockLocalStorage);

        storage.load(function(data) {
            assert.isArray(data);
            assert.deepEqual(data, ['test']);
            mock.verify();
            done();
        });
    });

    it("loads invalid data", function() {
        mock.expects('getItem').once().returns('foo');

        var storage = localStorage(null, mockLocalStorage);

        storage.load(function() {});

        mock.verify();
    });

    it("loads when storage throws", function() {
        mock.expects('getItem').once().throws('foo');

        var storage = localStorage(null, mockLocalStorage);

        storage.load(function() {});

        mock.verify();
    });

    it("clears store", function(done) {
        mock.expects('removeItem').once();

        var storage = localStorage(null, mockLocalStorage);

        storage.clear(function() {
            mock.verify();
            done();
        });
    });
});
