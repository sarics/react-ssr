import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './styles/global.scss';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

const App = () => (
  <React.Fragment>
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
