/* eslint react/jsx-filename-extension: 'off' */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';

import App from './App';

const getAsyncFiles = (modules, files) =>
  modules
    .map(moduleName => files[moduleName])
    .reduce(
      ({ css, js }, chunkFiles) => ({
        css: css.concat(chunkFiles.css),
        js: js.concat(chunkFiles.js),
      }),
      { css: [], js: [] },
    );

export default (req, res) => {
  Loadable.preloadAll().then(() => {
    const modules = [];
    const context = {};

    const jsx = (
      <Loadable.Capture report={modules.push}>
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

    const files = res.locals.files || req.app.locals.files || {};
    const { css: initialCss, js: initialJs } = files.initial;
    const { css: asyncCss, js: asyncJs } = getAsyncFiles(
      modules,
      files.asyncByRequest,
    );

    res.locals.helmet = Helmet.renderStatic();
    res.locals.css = initialCss.concat(asyncCss);
    res.locals.js = initialJs.concat(asyncJs);

    res.render('index');
  });
};
