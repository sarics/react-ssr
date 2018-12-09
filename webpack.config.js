const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isProd = process.env.NODE_ENV === 'production';

const mode = isProd ? 'production' : 'development';
const extensions = ['.wasm', '.mjs', '.js', '.jsx', '.json'];
const buildPath = path.resolve(__dirname, 'build');
const publicPath = '/';

const getRules = type => {
  const isClient = type === 'client';
  const isSSR = type === 'ssr';

  return [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
    },
    {
      test: /\.(scss|sass)$/,
      exclude: /node_modules/,
      use: [
        isProd && isClient && MiniCssExtractPlugin.loader,
        !isProd && isClient && { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: isProd ? 'c_[hash:8]' : '[name]__[local]--[hash:4]',
            exportOnlyLocals: isSSR,
            importLoaders: 1,
          },
        },
        {
          loader: 'sass-loader',
        },
      ].filter(Boolean),
    },
    {
      test: /favicon\.ico$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            emitFile: isClient,
          },
        },
      ],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'images/',
            emitFile: isClient,
          },
        },
      ],
    },
  ];
};

const clientConfig = {
  name: 'client',

  mode,

  entry: [
    !isProd && 'webpack-hot-middleware/client?name=client&reload=true',
    './src/client.js',
  ].filter(Boolean),

  output: {
    path: path.join(buildPath, 'public'),
    publicPath,
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
  },

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  resolve: {
    extensions,
  },

  module: {
    rules: getRules('client'),
  },

  plugins: [
    !isProd && new webpack.HotModuleReplacementPlugin(),

    isProd &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      }),
    new ManifestPlugin({
      fileName: '../manifest.json',
    }),
  ].filter(Boolean),

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

const ssrConfig = {
  name: 'ssr',

  mode,

  target: 'node',

  entry: './src/ssr.js',

  output: {
    path: buildPath,
    publicPath,
    filename: 'ssr.js',
    library: 'SSR',
    libraryTarget: 'commonjs2',
  },

  devtool: false,

  externals: [nodeExternals()],

  resolve: {
    extensions,
  },

  module: {
    rules: getRules('ssr'),
  },

  optimization: {
    minimize: false,
  },
};

module.exports = [clientConfig, ssrConfig];
