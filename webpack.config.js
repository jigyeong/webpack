var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main : './src/js/index.js',
    },
    output: {
        path : path.resolve('./public'),
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
    devServer: {
    //   open: true,
      port: 9000,
    },
  };