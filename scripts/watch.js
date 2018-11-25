/* eslint no-console: 'off', no-control-regex: 'off', import/no-extraneous-dependencies: 'off' */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackDevMiddlewareReporter = require('webpack-dev-middleware/lib/reporter');
const requireFromString = require('require-from-string');
const reload = require('reload');

const webpackConfig = require('../webpack.config');

const [clientConfig, ssrConfig] = webpackConfig;
const compiler = webpack(webpackConfig);

const app = express();
const reloadServer = reload(app);

app.set('view engine', 'ejs');

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: clientConfig.output.publicPath,
  serverSideRender: true,
  stats: 'errors-only',
  reporter: (middlewareOptions, options) => {
    webpackDevMiddlewareReporter(middlewareOptions, options);

    reloadServer.reload();
  },
});

app.use(devMiddleware);

app.get(/\./, (req, res) => {
  res.sendStatus(404);
});

app.get('/*', (req, res, next) => {
  const { webpackStats } = res.locals;
  if (webpackStats.hasErrors()) {
    const errMsg = webpackStats
      .toString('errors-only')
      .replace(/\x1b\[\d+m/g, '');
    next(new Error(errMsg));
    return;
  }

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

  res.locals.files = manifest;

  ssr(req, res, next);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.error = err;

  res.status(500);
  res.render('error', err);
});

app.listen(8080, () => {
  console.log('🚀 App listening on port 8080');
});
