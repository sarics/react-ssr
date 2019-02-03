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

export default ({ files }) => (req, res) => {
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

    const reactDOM = renderToString(jsx);
    if (context.url) {
      res.redirect(context.url);
      return;
    }

    const helmet = Helmet.renderStatic();

    const { css, js } = files.initial;
    const { css: asyncCss, js: asyncJs } = getAsyncFiles(
      modules,
      files.asyncByRequest,
    );

    res.render('index', { reactDOM, helmet, css, asyncCss, js, asyncJs });
  });
};
