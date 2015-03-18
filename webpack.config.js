var path = require("path");
var extend = require("extend");
var _ = require("lodash");
var webpack = require("webpack");
var pkg = require("./package.json");

var config = {
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js",
        library: "[name]",
        libraryTarget: "umd"
    },
    externals: {
        "jquery": {
            "root": "jQuery",
            "amd": "jquery",
            "commonjs": "jquery",
            "commonjs2": "jquery"
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.BannerPlugin(
            pkg.title + ' - v' + pkg.version + ' - ' +
            new Date().getFullYear() + '-' + _.padLeft(new Date().getMonth() + 1, 2, 0) + '-' + _.padLeft(new Date().getDate(), 2, 0) + '\n' +
            pkg.homepage + '\n' +
            'Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.author.name + ';' +
            ' Licensed ' + _.pluck(pkg.licenses, "type").join(", ")
        )
    ]
};

var configMin = extend(true, {}, config, {
    output: {
        filename: "[name].min.js"
    },
    plugins: [].concat([
        new webpack.optimize.UglifyJsPlugin({
            comments: /(?!x)x/
        })
    ], config.plugins)
});

// ---

var carty = extend(true, {}, config, {
    entry: {
        carty: "./"
    }
});

var cartyMin = extend(true, {}, configMin, {
    entry: {
        carty: "./"
    }
});

// ---

var cartyWithPromise = extend(true, {}, config, {
    entry: {
        "carty-promise-polyfill": ["./es6-promise-polyfill", "./"]
    },
    output: {
        library: "carty"
    }
});

var cartyWithPromiseMin = extend(true, {}, configMin, {
    entry: {
        "carty-promise-polyfill": ["./es6-promise-polyfill", "./"]
    },
    output: {
        library: "carty"
    }
});

// ---

module.exports = [
    carty,
    cartyMin,
    cartyWithPromise,
    cartyWithPromiseMin
];
