var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().get()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
        cart.add({id: 'Item'});
    });

    it("returns existing item", function(done) {
        cart
            .ready(function(cart) {
                var item = cart.get({id: 'Item'});
                assert.deepEqual(item, {
                    id: 'Item',
                    label: "Item",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("returns existing item passed as string", function(done) {
        cart
            .ready(function(cart) {
                var item = cart.get('Item');
                assert.deepEqual(item, {
                    id: 'Item',
                    label: "Item",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("returns existing item passed as item()", function(done) {
        cart
            .ready(function(cart) {
                var item = cart.get(cart.item('Item'));
                assert.deepEqual(item, {
                    id: 'Item',
                    label: "Item",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("returns null for missing item", function(done) {
        cart
            .ready(function(cart) {
                assert.isNull(cart.get({id: 'Missing'}));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("returns null for missing item passed as string", function(done) {
        cart
            .ready(function(cart) {
                assert.isNull(cart.get('Missing'));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("returns null for invalid item", function(done) {
        cart
            .ready(function(cart) {
                assert.isFalse(cart.has({}));
                assert.isFalse(cart.has({foo: 'bar'}));
                assert.isFalse(cart.has([]));
                assert.isFalse(cart.has(null));
                assert.isFalse(cart.has(undefined));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("ignores quantity", function(done) {
        cart
            .add({id: 'Item with quantity', quantity: 1})
            .ready(function(cart) {
                var item = cart.get({id: 'Item with quantity', quantity: 2});
                assert.deepEqual(item, {
                    id: 'Item with quantity',
                    label: "Item with quantity",
                    price: 0,
                    quantity: 1,
                    variant: {}
                });
            })
            .ready(function() {
                done();
            })
        ;
    });
});
