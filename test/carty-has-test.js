var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty().has", function() {
    var instance;

    beforeEach(function() {
        instance = carty();
        instance.add({id: 'Item'});
    });

    it("returns true for existing item", function() {
        assert(instance.has({id: 'Item'}));
    });

    it("returns true for existing item passed as string", function() {
        assert(instance.has('Item'));
    });

    it("returns false for missing item", function() {
        assert.isFalse(instance.has({id: 'Missing'}));
    });

    it("returns false for missing item passed as string", function() {
        assert.isFalse(instance.has('Missing'));
    });

    it("ignores quantity", function() {
        instance.add({id: 'Item with quantity', quantity: 1});
        assert(instance.has({id: 'Item with quantity', quantity: 2}));
    });
});
