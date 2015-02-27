var assert = require('chai').assert;
var carty = typeof window !== 'undefined' ? window.carty : require('../');

describe("carty().add", function() {
    var instance;

    beforeEach(function() {
        instance = carty();
    });

    it("adds an item", function() {
        instance.add({id: 'Item'});

        assert(instance.has({id: 'Item'}));
    });

    it("adds an item as string", function() {
        instance.add('Item');

        assert(instance.has({id: 'Item'}));
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

        instance.add(attr);

        var item = instance()[0];

        assert.strictEqual('id', item.id());
        assert.strictEqual('label', item.label());
        assert.strictEqual('EUR', item.currency());
        assert.strictEqual(10, item.shipping());
        assert.strictEqual(5, item.tax());

        var object = item();

        assert.strictEqual('id', object.id);
        assert.strictEqual('label', object.label);
        assert.strictEqual('EUR', object.currency);
        assert.strictEqual(10, object.shipping);
        assert.strictEqual(5, object.tax);
        assert.strictEqual('bar', object.foo);

        assert.isFalse(item.equals('foo'));
        assert.isFalse(item.equals(function() { return 'foo'; }));

        assert.isTrue(item.equals(attr));
        assert.isTrue(item.equals(function() { return attr; }));
    });

    it("updates quantity for existing item", function() {
        instance.add({id: 'Item'});
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(3, instance.get('Item').quantity());
    });

    it("updates quantity for existing item added as string", function() {
        instance.add('Item');
        instance.add('Item');

        assert.strictEqual(2, instance.get('Item').quantity());
    });

    it("updates quantity for mixed item type", function() {
        instance.add('Item');
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(3, instance.get('Item').quantity());
    });

    it("updates existing item attributes", function() {
        instance.add({id: 'Item', tax: 0});
        instance.add({id: 'Item', tax: .5, shipping: 10});

        assert.strictEqual(.5, instance.get('Item').tax());
        assert.strictEqual(10, instance.get('Item').shipping());
    });

    it("keeps custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});

        assert.strictEqual('foo', instance.get('Item').call().custom);
    });

    it("updates custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});
        instance.add({id: 'Item', custom: 'bar'});

        assert.strictEqual('bar', instance.get('Item').call().custom);
    });

    it("does not add an empty item", function() {
        assert.throw(function() {
            instance.add({});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id or label attribute.');
    });

    it("does not add an item without id and name attribute", function() {
        assert.throw(function() {
            instance.add({foo: 'bar'});
        }.bind(this), undefined, 'Item must be a string or an object with at least an id or label attribute.');
    });

    it("emits add event", function() {
        instance.on('add', function(it) {
            assert.strictEqual('Item', it);
        });

        instance.add('Item');
    });

    it("aborts if add event listener returns false", function() {
        instance.on('add', function() {
            return false;
        });

        instance.add('Item');

        assert.strictEqual(0, instance.size());
    });

    it("emits added event", function() {
        instance.on('added', function(it) {
            assert.strictEqual('Item', it.id());
        });

        instance.add('Item');
    });
});
