const webpack = require('webpack');

var config = {
    context: __dirname + '/js', // `__dirname` is root of project and `js` is source
    devtool: "cheap-module-eval-source-map",
    entry: {
        fbpviewer: './init.ts',
    },
    output: {
        path: __dirname + '/../AppBundle/Resources/public/js',
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
