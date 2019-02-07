import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';

import './styles/global.scss';

import Header from './components/Header';
import LoadingContent from './components/LoadingContent';

import faviconPath from './favicon.ico';

const LoadableHomePage = Loadable({
  loader: () => import(/* webpackChunkName: "pages/home" */ './pages/HomePage'),
  loading: LoadingContent,
});

const LoadableAboutPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "pages/about" */ './pages/AboutPage'),
  loading: LoadingContent,
});

const App = () => (
  <React.Fragment>
    <Helmet defaultTitle="React SSR" titleTemplate="%s - React SSR">
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      <link rel="shortcut icon" href={faviconPath} type="image/x-icon" />
    </Helmet>

    <Header />

    <Switch>
      <Route path="/" exact component={LoadableHomePage} />
      <Route path="/about" exact component={LoadableAboutPage} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </React.Fragment>
);

export default App;
