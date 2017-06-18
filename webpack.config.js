const webpack = require('webpack');

var config = {
    context: __dirname + '/src',
    devtool: "cheap-module-eval-source-map",
    entry: {
        fbpviewer: './init.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension (for require/import).
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
        ]
    },
    plugins: [
        // Makes jQuery globally available on the `window` object (required by Boostrap)
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

module.exports = config;
