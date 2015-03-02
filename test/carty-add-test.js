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

    it("uses id as label if label undefined", function() {
        var attr = {
            id: 'id'
        };

        instance.add(attr);

        var item = instance()[0];

        assert.strictEqual(item.label(), 'id');
    });

    it("uses label as id if id undefined", function() {
        var attr = {
            label: 'label'
        };

        instance.add(attr);

        var item = instance()[0];

        assert.strictEqual(item.id(), 'label');
    });

    it("updates quantity for existing item", function() {
        instance.add({id: 'Item'});
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(instance.get('Item').quantity(), 3);
    });

    it("updates quantity for existing item added as string", function() {
        instance.add('Item');
        instance.add('Item');

        assert.strictEqual(instance.get('Item').quantity(), 2);
    });

    it("updates quantity for mixed item type", function() {
        instance.add('Item');
        instance.add({id: 'Item', quantity: 2});

        assert.strictEqual(instance.get('Item').quantity(), 3);
    });

    it("updates existing item attributes", function() {
        instance.add({id: 'Item', tax: 0});
        instance.add({id: 'Item', tax: .5, shipping: 10});

        assert.strictEqual(instance.get('Item').tax(), .5);
        assert.strictEqual(instance.get('Item').shipping(), 10);
    });

    it("keeps custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});

        assert.strictEqual(instance.get('Item').call().custom, 'foo');
    });

    it("updates custom item attributes", function() {
        instance.add({id: 'Item', custom: 'foo'});
        instance.add({id: 'Item', custom: 'bar'});

        assert.strictEqual(instance.get('Item').call().custom, 'bar');
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

    it("compares item", function() {
        var attr = {
            label: 'label',
            foo: 'bar'
        };

        instance.add(attr);

        var item = instance()[0];

        assert(item.equals({label: 'label', foo: 'bar'}));
        assert(item.equals({label: 'label'}));
        assert(item.equals({id: 'label', foo: 'bar'}));
        assert(item.equals({id: 'label'}));
        assert(item.equals({id: 'label', label: 'bar'}));
        assert(item.equals(item));

        assert.isFalse(item.equals({label: 'foo'}));
        assert.isFalse(item.equals({foo: 'bar'}));
        assert.isFalse(item.equals({}));
        assert.isFalse(item.equals(null));
        assert.isFalse(item.equals(undefined));
    });

    it("emits add event", function() {
        instance.on('add', function(it) {
            assert.strictEqual(it, 'Item');
        });

        instance.add('Item');
    });

    it("aborts if add event listener returns false", function() {
        instance.on('add', function() {
            return false;
        });

        instance.add('Item');

        assert.strictEqual(instance.size(), 0);
    });

    it("emits added event", function() {
        instance.on('added', function(it) {
            assert.strictEqual(it.id(), 'Item');
        });

        instance.add('Item');
    });
});
