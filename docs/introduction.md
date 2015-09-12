Introduction
============

Carty is a lightweight shopping cart library implemented in JavaScript which can
be used either in the browser with jQuery or with Node.js.

Creating a cart
---------------

The cart is basically a collection of items which are either kept in memory or
stored persistent via a configured storage adapter.

```javascript
var carty = require('carty');

var cart = carty({
    storage: carty.storage.localStorage(),
    currency: 'USD'
});
```

You can add, get, remove and iterate the items and calculate the total price of
the cart.

```javascript
cart.add({
    id: 'awesome-product',
    label: 'Awesome product',
    price: 5.99,
    quantity: 2
});

var item = cart.get('awesome-product');
console.log(
    item.id(),
    item.label(),
    item.price(),
    item.quantity()
);

cart.remove('awesome-product');

cart.each(function(item) {
    console.log(
        item.id(),
        item.label(),
        item.price(),
        item.quantity()
    );
});

console.log(
    cart.total()
)
```
