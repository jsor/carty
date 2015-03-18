'use strict';

var carty = require('./lib/carty');

carty.format = {
    currency: require('./lib/format/currency'),
    number: require('./lib/format/number')
};

carty.storage = {
    localStorage: require('./lib/storage/local-storage')
};

carty.ui = {
    jquery: require('./lib/ui/jquery')
};

module.exports = carty;
