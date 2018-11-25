const path = require('path');
const nodeExternals = require('webpack-node-externals');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',

  target: 'node',

  entry: './src/ssr.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'ssr.js',
    library: 'SSR',
    libraryTarget: 'commonjs2',
  },

  devtool: false,

  externals: [nodeExternals()],

  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: isProd
                ? 'c_[hash:8]'
                : '[name]__[local]--[hash:4]',
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },

  optimization: {
    minimize: false,
  },
};
