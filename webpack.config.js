var path = require("path");
var extend = require("extend");
var _ = require("lodash");
var webpack = require("webpack");
var autoprefixer = require("autoprefixer-core");
var pkg = require("./package.json");

var config = {
    entry: {
        carty: "./index.js",
        'carty.store.localstorage': "./store/localStorage.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!postcss-loader!less-loader"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: [
        autoprefixer({
            browsers: [
                "Android 2.3",
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ]
        })
    ],
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
        ),
        new webpack.NoErrorsPlugin()
    ]
};

var configMin = extend(true, {}, config, {
    output: {
        filename: "[name].min.js"
    },
    plugins: config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin()
    ])
});

module.exports = [config, configMin];
