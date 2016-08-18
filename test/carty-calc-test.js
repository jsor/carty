var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().quantity()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
    });

    it("calculates quantity", function(done) {
        cart
            .add({id: 'Item'})
            .add({id: 'Item', quantity: 2})
            .add({id: 'Item2', quantity: 10})
            .ready(function() {
                assert.strictEqual(cart.quantity(), 13);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates quantity with non-float values", function(done) {
        cart
            .add({id: 'Item2', quantity: "10"})
            .ready(function() {
                assert.strictEqual(cart.quantity(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("ignores invalid values", function(done) {
        cart
            .add({id: 'Item', quantity: {}})
            .ready(function() {
                assert.strictEqual(cart.quantity(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("carty().subtotal()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
    });

    it("calculates subtotal", function(done) {
        cart
            .add({id: 'Item', quantity: 2, price: 10})
            .add({id: 'Item2', quantity: 10, price: .5})
            .ready(function() {
                assert.strictEqual(cart.subtotal(), (2 * 10) + (10 * .5));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates subtotal with mixed values", function(done) {
        cart
            .add({id: 'Item', quantity: 2, price: function() { return 10 }})
            .add({id: 'Item2', quantity: "10", price: ".5"})
            .ready(function() {
                assert.strictEqual(cart.subtotal(), (2 * 10) + (10 * .5));
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates subtotal with custom calculator", function(done) {
        cart.options('subtotal', function(items) {
            return '' + items.length;
        });

        cart
            .add({id: 'Item', quantity: 2, price: 10})
            .add({id: 'Item2', quantity: 10, price: .5})
            .ready(function() {
                assert.strictEqual(cart.subtotal(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates subtotal from storage", function(done) {
        var cart = carty({
            storage: {
                load: function() {
                    return {
                        items: [{id: 'Item'}, {id: 'Item2'}],
                        subtotal: 2
                    };
                },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });

        cart
            .ready(function() {
                assert.strictEqual(cart.subtotal(), 2);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("carty().shipping()", function() {
    var cart;

    it("calculates no shipping by default", function(done) {
        cart = carty();

        cart
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.shipping(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates shipping with custom calculator", function(done) {
        cart = carty({
            shipping: function() { return 10; }
        });

        cart
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.shipping(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates shipping from storage", function(done) {
        var cart = carty({
            storage: {
                load: function() {
                    return {
                        items: [{id: 'Item'}, {id: 'Item2'}],
                        shipping: 10
                    };
                },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });

        cart
            .ready(function() {
                assert.strictEqual(cart.shipping(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("carty().tax()", function() {
    var cart;

    it("calculates no tax by default", function(done) {
        cart = carty();

        cart
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.tax(), 0);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates tax with custom calculator", function(done) {
        cart = carty({
            tax: function() { return 10; }
        });

        cart
            .add('Item')
            .ready(function() {
                assert.strictEqual(cart.tax(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });

    it("calculates tax from storage", function(done) {
        var cart = carty({
            storage: {
                load: function() {
                    return {
                        items: [{id: 'Item'}, {id: 'Item2'}],
                        tax: 10
                    };
                },
                put: function (item, items) { },
                remove: function (item, items) { },
                clear: function () {}
            }
        });

        cart
            .ready(function() {
                assert.strictEqual(cart.tax(), 10);
            })
            .ready(function() {
                done();
            })
        ;
    });
});

describe("carty().total()", function() {
    var cart;

    it("calculates total", function(done) {
        cart = carty();

        cart.add({id: 'Item', price: 10})
            .add({id: 'Item2', price: "10"})
            .add({id: 'Item3'})
            .ready(function() {
                assert.strictEqual(cart.total(), 20);
            })
            .ready(function() {
                done();
            })
        ;
    });
});
