/* eslint no-console: 'off', import/no-extraneous-dependencies: 'off' */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const requireFromString = require('require-from-string');

const webpackConfig = require('../webpack.config');

const [clientConfig, ssrConfig] = webpackConfig;
const compiler = webpack(webpackConfig);

const app = express();

app.set('view engine', 'ejs');

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: clientConfig.output.publicPath,
  serverSideRender: true,
  stats: 'none',
});
const hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
});

app.use(devMiddleware);
app.use(hotMiddleware);

app.get('/*', (req, res, next) => {
  const manifestJSON = res.locals.fs.readFileSync(
    path.resolve(clientConfig.output.path, '../manifest.json'),
    'utf8',
  );
  const manifest = JSON.parse(manifestJSON);

  const ssrContents = res.locals.fs.readFileSync(
    path.resolve(ssrConfig.output.path, ssrConfig.output.filename),
    'utf8',
  );
  const ssr = requireFromString(ssrContents, ssrConfig.output.filename).default;

  res.locals.clientStats = res.locals.webpackStats
    .toJson()
    .children.find(({ name }) => name === 'client');
  res.locals.files = manifest;

  ssr(req, res, next);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.error = err;

  res.status(500);
  res.render('error');
});

app.listen(8080, () => {
  console.log('🚀 App listening on port 8080');
});
