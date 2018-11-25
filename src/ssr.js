/* eslint react/jsx-filename-extension: 'off' */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';

import App from './App';

export default (req, res) => {
  const context = {};

  const jsx = (
    <Router location={req.url} context={context}>
      <App />
    </Router>
  );

  res.locals.reactDOM = renderToString(jsx);
  if (context.url) {
    res.redirect(context.url);
    return;
  }

  res.render('index');
};
