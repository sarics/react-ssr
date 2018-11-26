import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './styles/global.scss';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

import faviconPath from './favicon.ico';

const App = () => (
  <React.Fragment>
    <Helmet defaultTitle="React RSS" titleTemplate="%s - React RSS">
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      <link rel="shortcut icon" href={faviconPath} type="image/x-icon" />
    </Helmet>

    <Header />

    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/about" exact component={AboutPage} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </React.Fragment>
);

export default App;
