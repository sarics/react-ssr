/* eslint react/jsx-filename-extension: 'off' */

import 'core-js';

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
      ({ css, js }, chunkFiles) => {
        const chunkCss = chunkFiles.css.filter(file => !css.includes(file));
        const chunkJs = chunkFiles.js.filter(file => !js.includes(file));

        return {
          css: css.concat(chunkCss),
          js: js.concat(chunkJs),
        };
      },
      { css: [], js: [] },
    );

export default ({ files }) => (req, res, next) => {
  Loadable.preloadAll()
    .then(() => {
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

      const { css: asyncCss, js: asyncJs } = getAsyncFiles(
        modules,
        files.asyncByRequest,
      );

      res.locals.asyncCss = asyncCss;
      res.locals.asyncJs = asyncJs;

      res.render('index');
    })
    .catch(next);
};
