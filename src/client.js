/* eslint react/jsx-filename-extension: 'off' */

import 'core-js';

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

const jsx = (
  <Router>
    <App />
  </Router>
);

hydrate(jsx, document.getElementById('app'));
