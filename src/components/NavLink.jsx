import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import classNames from 'classnames';

const NavLink = ({ className, activeClassName, exact, ...props }) => (
  <Link
    getProps={({ isCurrent, isPartiallyCurrent }) => ({
      className: classNames(
        className,
        ((exact && isCurrent) || (!exact && isPartiallyCurrent)) &&
          activeClassName,
      ),
    })}
    {...props}
  />
);

NavLink.propTypes = {
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  exact: PropTypes.bool,
};

NavLink.defaultProps = {
  className: undefined,
  activeClassName: 'active',
  exact: false,
};

export default NavLink;
