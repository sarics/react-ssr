/* eslint react/jsx-filename-extension: 'off' */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerLocation, isRedirect } from '@reach/router';
import { Helmet } from 'react-helmet';

import App from './App';

export default (req, res) => {
  const jsx = (
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );

  try {
    res.locals.reactDOM = renderToString(jsx);
  } catch (error) {
    if (isRedirect(error)) {
      res.redirect(error.uri);
      return;
    }
  }

  res.locals.helmet = Helmet.renderStatic();

  res.render('index');
};
