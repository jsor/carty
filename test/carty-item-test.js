var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().item()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
    });
    
    it("does not create an item from empty object", function() {
        assert.throw(function() {
            cart.item({});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("does not create an item from undefined", function() {
        assert.throw(function() {
            cart.item();
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("does not create an item from null", function() {
        assert.throw(function() {
            cart.item(null);
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("does not create an item without id property", function() {
        assert.throw(function() {
            cart.item({foo: 'bar'});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("creates an item from string", function() {
        var item = cart.item('id');
        var object = item();

        assert.strictEqual(object.id, 'id');
        assert.strictEqual(object.price, 0);
        assert.strictEqual(object.quantity, 1);
        assert.deepEqual(object.variant, {});
    });

    it("creates an item from object", function() {
        var attr = {
            id: 'id'
        };

        var item = cart.item(attr);
        var object = item();

        assert.strictEqual(object.id, 'id');
        assert.strictEqual(object.price, 0);
        assert.strictEqual(object.quantity, 1);
        assert.deepEqual(object.variant, {});
    });

    it("creates an item from function", function() {
        var item = cart.item(function() {
            return 'id';
        });

        var object = item();

        assert.strictEqual(object.id, 'id');
        assert.strictEqual(object.price, 0);
        assert.strictEqual(object.quantity, 1);
        assert.deepEqual(object.variant, {});
    });

    it("adds all item attributes", function() {
        var attr = {
            id: 'id',
            label: 'label',
            quantity: 12,
            price: 11,
            currency: 'EUR',
            shipping: 10,
            tax: 5,
            foo: 'bar',
            variant: 'variant'
        };

        var item = cart.item(attr);
        var object = item();

        assert.strictEqual(object.id, 'id');
        assert.strictEqual(object.label, 'label');
        assert.strictEqual(object.quantity, 12);
        assert.strictEqual(object.price, 11);
        assert.strictEqual(object.currency, 'EUR');
        assert.strictEqual(object.shipping, 10);
        assert.strictEqual(object.tax, 5);
        assert.strictEqual(object.foo, 'bar');
        assert.deepEqual(object.variant, {variant: 'variant'});

        assert.isFalse(item.equals('foo'));
        assert.isTrue(item.equals(attr));
    });

    it("uses id as label if label is undefined", function() {
        var attr = {
            id: 'id'
        };

        var item = cart.item(attr);

        assert.strictEqual(item().label, 'id');
    });

    it("compares items", function() {
        var attr = {
            id: 'label',
            foo: 'bar'
        };

        var item = cart.item(attr);

        assert.isTrue(item.equals({id: 'label', foo: 'bar'}));
        assert.isTrue(item.equals({id: 'label'}));
        assert.isTrue(item.equals({id: 'label', label: 'bar'}));

        assert.isFalse(item.equals({label: 'foo'}));
        assert.isFalse(item.equals({foo: 'bar'}));
        assert.isFalse(item.equals({}));
        assert.isFalse(item.equals(null));
        assert.isFalse(item.equals(undefined));
    });

    it("compares items with mixed string/number ids", function() {
        var attr = {
            id: 123,
            foo: 'bar'
        };

        var item = cart.item(attr);

        assert.isTrue(item.equals({id: 123, foo: 'bar'}));
        assert.isTrue(item.equals({id: 123}));
        assert.isTrue(item.equals({id: 123, label: 'bar'}));

        assert.isTrue(item.equals({id: '123', foo: 'bar'}));
        assert.isTrue(item.equals({id: '123'}));
        assert.isTrue(item.equals({id: '123', label: 'bar'}));

        assert.isFalse(item.equals({id: '1234'}));
        assert.isFalse(item.equals({id: 1234}));
    });

    it("compares items with string variant", function() {
        var attr = {
            id: 'label',
            variant: 'variant'
        };

        var item = cart.item(attr);

        assert.isTrue(item.equals({id: 'label', variant: 'variant'}));
        assert.isTrue(item.equals({id: 'label', label: 'bar', variant: 'variant'}));

        assert.isFalse(item.equals({label: 'foo'}));
        assert.isFalse(item.equals({variant: 'variant'}));
        assert.isFalse(item.equals({id: 'label', variant: ['variant']}));
    });

    it("compares items with object variant", function() {
        var attr = {
            id: 'label',
            variant: {
                variant1: 'variant1',
                variant2: 'variant2'
            }
        };

        var item = cart.item(attr);

        assert.isTrue(item.equals({id: 'label', variant: {
            variant1: 'variant1',
            variant2: 'variant2'
        }}));
        assert.isTrue(item.equals({id: 'label', label: 'bar', variant: {
            variant1: 'variant1',
            variant2: 'variant2'
        }}));

        assert.isFalse(item.equals({label: 'foo'}));
        assert.isFalse(item.equals({id: 'label', variant: {
            variant1: 'variant1',
            variant3: 'variant3'
        }}));
        assert.isFalse(item.equals({variant: {
            variant1: 'variant1',
            variant2: 'variant2'
        }}));
    });

    it("respects cart options", function() {
        cart = carty({
            decimalSeparator: '#'
        });

        var attr = {
            id: 'label',
            price: '100#50'
        };

        var item = cart.item(attr);

        assert.strictEqual(item().price, 100.5);
    });
});
