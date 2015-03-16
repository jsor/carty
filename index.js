'use strict';

var carty = require('./lib/cart');

carty.storage = {
    localStorage: require('./lib/storage/local-storage')
};

carty.ui = {
    jquery: require('./lib/ui/jquery')
};

module.exports = carty;
