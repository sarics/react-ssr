const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isProd = process.env.NODE_ENV === 'production';

const mode = isProd ? 'production' : 'development';
const extensions = ['.wasm', '.mjs', '.js', '.jsx', '.json'];
const buildPath = path.resolve(__dirname, 'build');

const getRules = type => {
  const isClient = type === 'client';

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
        isClient && MiniCssExtractPlugin.loader,
        {
          loader: isClient ? 'css-loader' : 'css-loader/locals',
          options: {
            modules: true,
            localIdentName: isProd ? 'c_[hash:8]' : '[name]__[local]--[hash:4]',
            importLoaders: 1,
          },
        },
        {
          loader: 'sass-loader',
        },
      ].filter(Boolean),
    },
    {
      test: /\.(jpe?g|png|gif|svg|ico)$/,
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

  entry: './src/client.js',

  output: {
    path: path.join(buildPath, 'public'),
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    publicPath: '/',
  },

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  resolve: {
    extensions,
  },

  module: {
    rules: getRules('client'),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isProd ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
    }),
    new ManifestPlugin({
      fileName: '../manifest.json',
    }),
  ],

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
    publicPath: '/',
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
