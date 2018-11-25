import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './Content.scss';

const Content = ({ component: Component, className, ...props }) => (
  <Component className={classNames(classes.content, className)} {...props} />
);

Content.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
};

Content.defaultProps = {
  component: 'main',
  className: undefined,
};

export default Content;
