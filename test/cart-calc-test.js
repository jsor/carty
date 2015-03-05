var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

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
                done();
            })
        ;
    });

    it("calculates quantity with non-float values", function(done) {
        instance
            .add({id: 'Item2', quantity: "10"})
            .ready(function() {
                assert.strictEqual(instance.quantity(), 10);
                done();
            })
        ;
    });

    it("ignores invalid values", function(done) {
        instance
            .add({id: 'Item', quantity: {}})
            .ready(function() {
                assert.strictEqual(instance.quantity(), 0);
                done();
            })
        ;
    });
});

describe("cart().total()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("calculates total", function(done) {
        instance
            .add({id: 'Item', quantity: 2, price: 10})
            .add({id: 'Item2', quantity: 10, price: .5})
            .ready(function() {
                assert.strictEqual(instance.total(), (2 * 10) + (10 * .5));
                done();
            })
        ;
    });

    it("calculates total with mixed values", function(done) {
        instance
            .add({id: 'Item', quantity: 2, price: function() { return 10 }})
            .add({id: 'Item2', quantity: "10", price: ".5"})
            .ready(function() {
                assert.strictEqual(instance.total(), (2 * 10) + (10 * .5));
                done();
            })
        ;
    });
});

describe("cart().currency()", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("returns default currency", function() {
        assert.strictEqual(instance.currency(), 'USD');
    });

    it("returns configured currency", function() {
        instance = cart({currency: 'EUR'});
        assert.strictEqual(instance.currency(), 'EUR');
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

    it("calculates shipping from global option", function(done) {
        instance = cart({
            shipping: 10
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), 10);
                done();
            })
        ;
    });

    it("calculates shipping from global option with function", function(done) {
        instance = cart({
            shipping: function() { return 10; }
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), 10);
                done();
            })
        ;
    });

    it("calculates shipping from global option with string", function(done) {
        instance = cart({
            shipping: ".5"
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.shipping(), .5);
                done();
            })
        ;
    });

    it("calculates shipping with item shippings", function(done) {
        instance = cart({
            shipping: 10
        });

        instance
            .add({id: 'Item', shipping: 10})
            .ready(function() {
                assert.strictEqual(instance.shipping(), 20);
                done();
            })
        ;
    });

    it("calculates shipping with mixed item shippings", function(done) {
        instance = cart({
            shipping: 10
        });

        instance.add({id: 'Item', shipping: 10})
            .add({id: 'Item2', shipping: "10"})
            .add({id: 'Item3', shipping: function() { return 10 }})
            .ready(function() {
                assert.strictEqual(instance.shipping(), 40);
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

    it("calculates tax from global option", function(done) {
        instance = cart({
            tax: 10
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), 10);
                done();
            })
        ;
    });

    it("calculates tax from global option with function", function(done) {
        instance = cart({
            tax: function() { return 10; }
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), 10);
                done();
            })
        ;
    });

    it("calculates tax from global option with string", function(done) {
        instance = cart({
            tax: ".5"
        });

        instance
            .add('Item')
            .ready(function() {
                assert.strictEqual(instance.tax(), .5);
                done();
            })
        ;
    });

    it("calculates tax with item taxes", function(done) {
        instance = cart({
            tax: 10
        });

        instance
            .add({id: 'Item', tax: 10})
            .ready(function() {
                assert.strictEqual(instance.tax(), 20);
                done();
            })
        ;
    });

    it("calculates tax with mixed item taxes", function(done) {
        instance = cart({
            tax: 10
        });

        instance.add({id: 'Item', tax: 10})
            .add({id: 'Item2', tax: "10"})
            .add({id: 'Item3', tax: function() { return 10 }})
            .ready(function() {
                assert.strictEqual(instance.tax(), 40);
                done();
            })
        ;
    });
});

describe("cart().grandTotal()", function() {
    var instance;

    it("calculates grandTotal", function(done) {
        instance = cart({
            tax: 10,
            shipping: 10
        });

        instance.add({id: 'Item', tax: 10})
            .add({id: 'Item2', tax: "10"})
            .add({id: 'Item3', tax: function() { return 10 }})
            .ready(function() {
                assert.strictEqual(instance.grandTotal(), 50);
                done();
            })
        ;
    });
});
