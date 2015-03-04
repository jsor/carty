Carty
=====

[![Build Status](https://travis-ci.org/jsor/carty.svg?branch=master)](https://travis-ci.org/jsor/carty)
[![Coverage Status](https://coveralls.io/repos/jsor/carty/badge.svg)](https://coveralls.io/r/jsor/carty)

A lightweight and simple to use shopping cart.

Browser Support and Polyfills
-----------------------------

Carty makes use of ES5 and ES6 features but doesn't ship itself with any
polyfills. Use the following list to include polyfills for browsers and/or node
versions.

### ES5

You may use ES5 polyfills for the following features (if you have to support
browsers like IE8 for example):

* [`Array.prototype.every`](http://kangax.github.io/compat-table/es5/#Array.prototype.every)
* [`Array.prototype.map`](http://kangax.github.io/compat-table/es5/#Array.prototype.map)
* [`Function.prototype.bind`](http://kangax.github.io/compat-table/es5/#Function.prototype.bind)

You can use [es5-shim](https://github.com/es-shims/es5-shim) which provides the
required polyfills.

### ES6

You may use ES6 polyfills for the following features:

* [Promises](http://kangax.github.io/compat-table/es6/#Promise).

[ES6 Promises](http://people.mozilla.org/%7Ejorendorff/es6-draft.html#sec-promise-constructor)
are supported in Node since version 0.11.13.

For browser support, check [caniuse](http://caniuse.com/#search=promise)

You can use [es6-promise](https://github.com/jakearchibald/es6-promise) to
polyfill both node and browsers.

### Other

If you use the localStorage store adapter, you may polyfill 
[JSON](http://caniuse.com/#search=JSON) with
[json2](https://github.com/douglascrockford/JSON-js).

Running the Tests
-----------------

### Node

    $ npm install
    $ make test

License
-------

Copyright (c) 2015 Jan Sorgalla.
Released under the [MIT](LICENSE?raw=1) license.
