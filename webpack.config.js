var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main : './src/js/index.js',
    },
    output: {
        path : path.resolve('public'),
        filename : '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: './static/asset/favicon.ico',
            template: './static/index.html',
            minify: true,
            chunks: ['main']
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        hot: true,
        port: 9000
        // open: true,
    },
  };