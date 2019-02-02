import React from 'react';
import { Router } from '@reach/router';
import { Helmet } from 'react-helmet';

import './styles/global.scss';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import faviconPath from './favicon.ico';

const App = () => (
  <React.Fragment>
    <Helmet defaultTitle="React SSR" titleTemplate="%s - React SSR">
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      <link rel="shortcut icon" href={faviconPath} type="image/x-icon" />
    </Helmet>

    <Header />

    <Router>
      <HomePage path="/" />
      <AboutPage path="about" />
      <NotFoundPage default />
    </Router>
  </React.Fragment>
);

export default App;
