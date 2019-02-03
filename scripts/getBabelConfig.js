const { isClient } = require('./configTypes');

const isProd = process.env.NODE_ENV === 'production';

module.exports = type => ({
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
