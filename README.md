Carty
=====

[![Build Status](https://travis-ci.org/jsor/carty.svg?branch=master)](https://travis-ci.org/jsor/carty)
[![Coverage Status](https://coveralls.io/repos/jsor/carty/badge.svg)](https://coveralls.io/r/jsor/carty)

A lightweight and simple to use shopping cart.

Browser Support and Polyfills
-----------------------------

Carty doesn't ship with any polyfills. You may use polyfills for the following
features (if you have to support IE8 for example):

* Array.prototype.every
* Array.prototype.map
* Function.prototype.bind

Checkout [es5-shim](https://github.com/es-shims/es5-shim) which provides the
required polyfills.

If you use the localStorage store adapter, you may polyfill JSON with
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
