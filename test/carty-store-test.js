var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty()", function() {
    var store = {
        enabled: function() { return true; },
        save: function (data, done) { done(); },
        load: function (done) { return done([]) },
        clear: function (done) { done(); }
    }, mock;

    beforeEach(function() {
        mock = sinon.mock(store)
    });

    it("saves items to store", function() {
        mock.expects('save').twice();

        var instance = carty({store: store});

        instance.add('Item');
        instance.add('Item2');

        mock.verify();
    });

    it("emits save event", function(done) {
        var instance = carty({store: store});

        instance.on('save', function() {
            done();
        });

        instance.add('Item');
    });

    it("emits saved event", function(done) {
        var instance = carty({store: store});

        instance.on('saved', function() {
            done();
        });

        instance.add('Item');
    });

    it("emits saved event without store", function(done) {
        var instance = carty();

        instance.on('saved', function() {
            done();
        });

        instance.add('Item');
    });

    it("loads items from store", function() {
        mock.expects('load').once().callsArgWith(0, [{id: 'id'}]);

        var instance = carty({store: store});

        assert.strictEqual(1, instance.size());
        assert.strictEqual(1, instance().length);

        mock.verify();
    });

    it("clears store", function() {
        mock.expects('clear').once();

        carty({store: store}).clear();

        mock.verify();
    });

    it("emits clear event", function(done) {
        var instance = carty({store: store});

        instance.on('clear', function() {
            done();
        });

        instance.clear();
    });

    it("emits cleared event", function(done) {
        var instance = carty({store: store});

        instance.on('cleared', function() {
            done();
        });

        instance.clear();
    });

    it("emits cleared event without store", function(done) {
        var instance = carty();

        instance.on('cleared', function() {
            done();
        });

        instance.clear();
    });
});
