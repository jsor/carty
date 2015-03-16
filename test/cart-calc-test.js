var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../lib/cart');

describe("cart().quantity()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("calculates quantity", function(done) {
        instance.add({id: 'Item'})
            .add({id: 'Item', quantity: 2})
            .add({id: 'Item2', quantity: 10})
            .ready(function() {
                assert.strictEqual(instance.quantity(), 13);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates quantity with non-float values", function(done) {
        instance
            .add({id: 'Item2', quantity: "10"})
            .ready(function() {
                assert.strictEqual(instance.quantity(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("ignores invalid values", function(done) {
        instance
            .add({id: 'Item', quantity: {}})
            .ready(function() {
                assert.strictEqual(instance.quantity(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("cart().subtotal()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("calculates subtotal", function(done) {
        instance
            .add({id: 'Item', quantity: 2, price: 10})
            .add({id: 'Item2', quantity: 10, price: .5})
            .ready(function() {
                assert.strictEqual(instance.subtotal(), (2 * 10) + (10 * .5));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates subtotal with mixed values", function(done) {
        instance
            .add({id: 'Item', quantity: 2, price: function() { return 10 }})
            .add({id: 'Item2', quantity: "10", price: ".5"})
            .ready(function() {
                assert.strictEqual(instance.subtotal(), (2 * 10) + (10 * .5));
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("cart().shipping()", function() {
    var instance;

    it("calculates no shipping for empty cart", function() {
        instance = cart({
            shipping: 10
        });

        assert.strictEqual(instance.shipping(), 0);
    });

    it("calculates shipping", function(done) {
        instance = cart({
            shipping: 10
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates shipping with function", function(done) {
        instance = cart({
            shipping: function() { return 10; }
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates shipping with string", function(done) {
        instance = cart({
            shipping: ".5"
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), .5);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("cart().tax()", function() {
    var instance;

    it("calculates no tax for empty cart", function() {
        instance = cart({
            tax: 10
        });

        assert.strictEqual(instance.tax(), 0);
    });

    it("calculates tax", function(done) {
        instance = cart({
            tax: 10
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates tax with function", function(done) {
        instance = cart({
            tax: function() { return 10; }
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates tax from with string", function(done) {
        instance = cart({
            tax: ".5"
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), .5);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("cart().total()", function() {
    var instance;

    it("calculates total", function(done) {
        instance = cart({
            tax: 10,
            shipping: 10
        });

        instance.add({id: 'Item', price: 10})
            .add({id: 'Item2', price: "10"})
            .add({id: 'Item3'})
            .ready(function() {
                assert.strictEqual(instance.total(), 40);
            })
            .ready(function() {
                done();
            })
        ;
    });
});
