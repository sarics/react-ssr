const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const mode = isProd ? 'production' : 'development';
const extensions = ['.wasm', '.mjs', '.js', '.jsx', '.json'];
const buildPath = path.resolve(__dirname, 'build');
const publicPath = '/';

const isClient = type => type === 'client';
const isSSR = type => type === 'ssr';

const getBabelCfg = type => ({
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProd,
        useBuiltIns: true,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true,
      },
    ],
    '@babel/plugin-transform-runtime',
    isClient(type)
      ? '@babel/plugin-syntax-dynamic-import'
      : 'dynamic-import-node',
    'react-loadable/babel',
    isProd && [
      'babel-plugin-transform-react-remove-prop-types',
      {
        removeImport: true,
      },
    ],
  ].filter(Boolean),
});

const getRules = type => [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,

          ...getBabelCfg(type),
        },
      },
    ],
  },
  {
    test: /\.(scss|sass)$/,
    exclude: /node_modules/,
    use: [
      isProd && isClient(type) && MiniCssExtractPlugin.loader,
      !isProd && isClient(type) && { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: isProd ? 'c_[hash:8]' : '[name]__[local]--[hash:4]',
          exportOnlyLocals: isSSR(type),
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
          emitFile: isClient(type),
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
          emitFile: isClient(type),
        },
      },
    ],
  },
];

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

    isProd && new StatsPlugin('../stats.json'),
  ].filter(Boolean),

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|scss|sass)$/,
          chunks: 'initial',
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
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
