/* eslint react/jsx-filename-extension: 'off' */

import 'core-js';

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Loadable from 'react-loadable';

import App from './App';

const jsx = (
  <Router>
    <App />
  </Router>
);

Loadable.preloadReady().then(() => {
  hydrate(jsx, document.getElementById('app'));
});
