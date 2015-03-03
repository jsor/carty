var assert = require('chai').assert;
var cart = typeof window !== 'undefined' ? window.carty : require('../cart');

describe("cart().quantity", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("calculates quantity", function() {
        instance.add({id: 'Item'});
        instance.add({id: 'Item', quantity: 2});
        instance.add({id: 'Item2', quantity: 10});

        assert.strictEqual(instance.quantity(), 13);
    });

    it("calculates quantity with non-float values", function() {
        instance.add({id: 'Item2', quantity: "10"});

        assert.strictEqual(instance.quantity(), 10);
    });

    it("ignores invalid values", function() {
        instance.add({id: 'Item', quantity: {}});

        assert.strictEqual(instance.quantity(), 0);
    });
});

describe("cart().total", function() {
    var instance;

    beforeEach(function() {
        instance = cart();
    });

    it("calculates total", function() {
        instance.add({id: 'Item', quantity: 2, price: 10});
        instance.add({id: 'Item2', quantity: 10, price: .5});

        assert.strictEqual(instance.total(), (2 * 10) + (10 * .5));
    });

    it("calculates total with mixed values", function() {
        instance.add({id: 'Item', quantity: 2, price: function() { return 10 }});
        instance.add({id: 'Item2', quantity: "10", price: ".5"});

        assert.strictEqual(instance.total(), (2 * 10) + (10 * .5));
    });
});

describe("cart().shipping", function() {
    var instance;

    it("calculates no shipping for empty cart", function() {
        instance = cart({
            shipping: 10
        });

        assert.strictEqual(instance.shipping(), 0);
    });

    it("calculates shipping from global option", function() {
        instance = cart({
            shipping: 10
        });

        instance.add('Item');

        assert.strictEqual(instance.shipping(), 10);
    });

    it("calculates shipping from global option with function", function() {
        instance = cart({
            shipping: function() { return 10; }
        });

        instance.add('Item');

        assert.strictEqual(instance.shipping(), 10);
    });

    it("calculates shipping from global option with string", function() {
        instance = cart({
            shipping: ".5"
        });

        instance.add('Item');

        assert.strictEqual(instance.shipping(), .5);
    });

    it("calculates shipping with item shippings", function() {
        instance = cart({
            shipping: 10
        });

        instance.add({id: 'Item', shipping: 10});

        assert.strictEqual(instance.shipping(), 20);
    });

    it("calculates shipping with mixed item shippings", function() {
        instance = cart({
            shipping: 10
        });

        instance.add({id: 'Item', shipping: 10});
        instance.add({id: 'Item2', shipping: "10"});
        instance.add({id: 'Item3', shipping: function() { return 10 }});

        assert.strictEqual(instance.shipping(), 40);
    });
});

describe("cart().tax", function() {
    var instance;

    it("calculates no tax for empty cart", function() {
        instance = cart({
            tax: 10
        });

        assert.strictEqual(instance.tax(), 0);
    });

    it("calculates tax from global option", function() {
        instance = cart({
            tax: 10
        });

        instance.add('Item');

        assert.strictEqual(instance.tax(), 10);
    });

    it("calculates tax from global option with function", function() {
        instance = cart({
            tax: function() { return 10; }
        });

        instance.add('Item');

        assert.strictEqual(instance.tax(), 10);
    });

    it("calculates tax from global option with string", function() {
        instance = cart({
            tax: ".5"
        });

        instance.add('Item');

        assert.strictEqual(instance.tax(), .5);
    });

    it("calculates tax with item taxes", function() {
        instance = cart({
            tax: 10
        });

        instance.add({id: 'Item', tax: 10});

        assert.strictEqual(instance.tax(), 20);
    });

    it("calculates tax with mixed item taxes", function() {
        instance = cart({
            tax: 10
        });

        instance.add({id: 'Item', tax: 10});
        instance.add({id: 'Item2', tax: "10"});
        instance.add({id: 'Item3', tax: function() { return 10 }});

        assert.strictEqual(instance.tax(), 40);
    });
});

describe("cart().grandTotal", function() {
    var instance;

    it("calculates grandTotal", function() {
        instance = cart({
            tax: 10,
            shipping: 10
        });

        instance.add({id: 'Item', tax: 10});
        instance.add({id: 'Item2', tax: "10"});
        instance.add({id: 'Item3', tax: function() { return 10 }});

        assert.strictEqual(instance.grandTotal(), 50);
    });
});
