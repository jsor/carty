'use strict';

module.exports = carty;

var $ = require('jquery');
var currencies = require('../lib/util/currencies');
var createCart = require('../lib/cart');
var createLocalStorageStorage = require('../lib/storage/local-storage');
var createJqueryUi = require('../lib/ui/jquery');

var jqueryUi = createJqueryUi(window.document, $);

var _defaultOptions = {
    namespace: 'carty',
    currencies: currencies
};

function carty(options) {
    var _options = $.extend({}, _defaultOptions, options);
    _options.storage = _options.storage || createLocalStorageStorage(window.localStorage, _options.namespace);

    var cart = createCart(_options);

    cart.ui = jqueryUi(cart, _options);

    return cart;
}
