/* eslint react/jsx-filename-extension: 'off' */

import 'core-js';

import React from 'react';
import { hydrate } from 'react-dom';

import App from './App';

const jsx = <App />;

hydrate(jsx, document.getElementById('app'));
