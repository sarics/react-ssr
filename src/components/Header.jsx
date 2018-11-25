import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Header.scss';

import Button from './Button';

const Header = () => (
  <header className={classes.header}>
    <div className={classes.logo} />

    <div className={classes.brand}>
      React SSR{' '}
      <span role="img" aria-label="rocket">
        🚀
      </span>
    </div>

    <nav className={classes.nav}>
      <Button component={NavLink} to="/" exact variant="primary">
        Home
      </Button>
      <Button component={NavLink} to="/about" exact>
        About
      </Button>
      <Button component={NavLink} to="/notfound" exact variant="danger">
        404
      </Button>
    </nav>
  </header>
);

export default Header;
