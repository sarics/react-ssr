/* eslint react/jsx-filename-extension: 'off' */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';

import App from './App';

const getBundles = (modules, stats, files) =>
  modules.reduce(
    (bundles, modName) => {
      const modChunk = stats.chunks.find(
        chunk =>
          !chunk.initial &&
          chunk.origins.some(orig => orig.request === modName),
      );

      if (!modChunk) return bundles;

      const modFiles = modChunk.files
        .filter(file => !/\.map$/.test(file))
        .map(file => files[file]);

      return {
        css: bundles.css.concat(modFiles.filter(file => /\.css$/.test(file))),
        js: bundles.js.concat(modFiles.filter(file => /\.js$/.test(file))),
      };
    },
    { css: [], js: [] },
  );

export default (req, res) => {
  Loadable.preloadAll().then(() => {
    const modules = [];
    const context = {};

    const jsx = (
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Router location={req.url} context={context}>
          <App />
        </Router>
      </Loadable.Capture>
    );

    res.locals.reactDOM = renderToString(jsx);
    if (context.url) {
      res.redirect(context.url);
      return;
    }

    res.locals.helmet = Helmet.renderStatic();
    res.locals.bundles = getBundles(
      modules,
      res.locals.clientStats || req.app.locals.clientStats,
      res.locals.files || req.app.locals.files,
    );

    res.render('index');
  });
};
