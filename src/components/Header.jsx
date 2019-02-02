import React from 'react';
import { Link } from '@reach/router';

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

    <nav>
      <Button
        component={Link}
        to="/"
        variant="primary"
        className={classes.navButton}
      >
        Home
      </Button>
      <Button component={Link} to="/about" className={classes.navButton}>
        About
      </Button>
      <Button
        component={Link}
        to="/notfound"
        variant="danger"
        className={classes.navButton}
      >
        404
      </Button>
    </nav>
  </header>
);

export default Header;
