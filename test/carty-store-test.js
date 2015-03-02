var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty()", function() {
    var store = {
        save: function () {},
        load: function () { return [] },
        clear: function () {}
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

    it("loads items from store", function() {
        mock.expects('load').once().returns([]);

        carty({store: store});

        mock.verify();
    });

    it("clears store", function() {
        mock.expects('clear').once();

        carty({store: store}).clear();

        mock.verify();
    });
});
