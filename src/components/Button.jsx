import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './Button.scss';

const Button = ({
  component: Component,
  className,
  variant,
  outlined,
  disabled,
  ...props
}) => (
  <Component
    className={classNames(
      classes.base,
      classes[variant],
      outlined ? classes.outlined : classes.normal,
      disabled && classes.disabled,
      className,
    )}
    disabled={disabled}
    {...props}
  />
);

Button.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'danger']),
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  component: 'button',
  className: undefined,
  variant: 'default',
  outlined: false,
  disabled: false,
};

export default Button;
