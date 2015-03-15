module.exports = {
    cart: require('./lib/cart'),
    item: require('./lib/item'),
    storage: {
        localStorage: require('./lib/storage/local-storage')
    },
    ui: {
        jquery: require('./lib/ui/jquery')
    }
};
