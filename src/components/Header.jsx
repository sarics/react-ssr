import React from 'react';

import classes from './Header.scss';

import Button from './Button';
import NavLink from './NavLink';

const Header = () => (
  <header className={classes.header}>
    <div className={classes.logo} />

    <div className={classes.brand}>
      React SSR{' '}
      <span role="img" aria-label="rocket">
        🚀
      </span>
    </div>

    <nav>
      <Button
        component={NavLink}
        to="/"
        exact
        variant="primary"
        className={classes.navButton}
      >
        Home
      </Button>
      <Button
        component={NavLink}
        to="/about"
        exact
        className={classes.navButton}
      >
        About
      </Button>
      <Button
        component={NavLink}
        to="/notfound"
        exact
        variant="danger"
        className={classes.navButton}
      >
        404
      </Button>
    </nav>
  </header>
);

export default Header;
