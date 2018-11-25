/* eslint no-console: 'off', import/no-extraneous-dependencies: 'off' */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const express = require('express');
const webpack = require('webpack');
const requireFromString = require('require-from-string');

const clientConfig = require('../webpack.config.client');
const ssrConfig = require('../webpack.config.ssr');

const { getFilesFromStats, buildManifest } = require('./utils');

const startApp = stats => {
  const app = express();
  app.set('view engine', 'ejs');

  const clientStats = stats.children.find(({ name }) => name === 'client');
  const clientFiles = getFilesFromStats(clientStats);
  const files = buildManifest(clientFiles, clientConfig.output.publicPath);

  const ssrContents = fs.readFileSync(
    path.resolve(ssrConfig.output.path, ssrConfig.output.filename),
    'utf8',
  );
  const ssr = requireFromString(ssrContents, ssrConfig.output.filename).default;

  app.use(express.static(clientConfig.output.path));

  app.get(/\./, (req, res) => {
    res.sendStatus(404);
  });

  app.get('/*', (req, res, next) => {
    res.locals.files = files;

    ssr(req, res, next);
  });

  app.listen(8080, () => {
    console.log('🚀 App listening on port 8080');
  });
};

const startCompile = () => {
  const compiler = webpack([
    Object.assign({}, clientConfig, { name: 'client' }),
    Object.assign({}, ssrConfig, { name: 'ssr' }),
  ]);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    console.log(stats.toString({ colors: true }));

    if (stats.hasErrors()) return;

    startApp(stats.toJson());
  });
};

rimraf('build', err => {
  if (err) {
    console.error(err);
    return;
  }

  startCompile();
});
