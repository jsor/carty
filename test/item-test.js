var assert = require('chai').assert;
var createItem = typeof window !== 'undefined' ? window.carty.item : require('../lib/item');

describe("item()", function() {
    it("does not create an empty item", function() {
        assert.throw(function() {
            createItem({});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("does not create an item without id property", function() {
        assert.throw(function() {
            createItem({foo: 'bar'});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id property.');
    });

    it("returns default attributes", function() {
        var attr = {
            id: 'id'
        };

        var item = createItem(attr);

        assert.strictEqual(item.price(), 0);
        assert.isNull(item.currency());
        assert.strictEqual(item.shipping(), 0);
        assert.strictEqual(item.tax(), 0);

        var object = item();

        assert.strictEqual(object.price, 0);
        assert.isNull(object.currency);
        assert.strictEqual(object.shipping, 0);
        assert.strictEqual(object.tax, 0);
    });

    it("adds all item attributes", function() {
        var attr = {
            id: 'id',
            label: 'label',
            currency: 'EUR',
            shipping: 10,
            tax: 5,
            foo: 'bar'
        };

        var item = createItem(attr);

        assert.strictEqual(item.id(), 'id');
        assert.strictEqual(item.label(), 'label');
        assert.strictEqual(item.currency(), 'EUR');
        assert.strictEqual(item.shipping(), 10);
        assert.strictEqual(item.tax(), 5);

        var object = item();

        assert.strictEqual(object.id, 'id');
        assert.strictEqual(object.label, 'label');
        assert.strictEqual(object.currency, 'EUR');
        assert.strictEqual(object.shipping, 10);
        assert.strictEqual(object.tax, 5);
        assert.strictEqual(object.foo, 'bar');

        assert.isFalse(item.equals('foo'));
        assert.isFalse(item.equals(function() { return 'foo'; }));

        assert.isTrue(item.equals(attr));
        assert.isTrue(item.equals(function() { return attr; }));
    });

    it("uses id as label if label is undefined", function() {
        var props = {
            id: 'id'
        };

        var item = createItem(props);

        assert.strictEqual(item.label(), 'id');
    });

    it("compares items", function() {
        var props = {
            id: 'label',
            foo: 'bar'
        };

        var item = createItem(props);

        assert.isTrue(item.equals({id: 'label', foo: 'bar'}));
        assert.isTrue(item.equals({id: 'label'}));
        assert.isTrue(item.equals({id: 'label', label: 'bar'}));
        assert.isTrue(item.equals(item));

        assert.isFalse(item.equals({label: 'foo'}));
        assert.isFalse(item.equals({foo: 'bar'}));
        assert.isFalse(item.equals({}));
        assert.isFalse(item.equals(null));
        assert.isFalse(item.equals(undefined));
    });
});
