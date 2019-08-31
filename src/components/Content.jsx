/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import classes from './Content.scss';

const Content = ({
  component: Component,
  className,
  children,
  title,
  ...props
}) => (
  <Component className={classNames(classes.content, className)} {...props}>
    <Helmet>
      <title>{title}</title>
    </Helmet>

    {children}
  </Component>
);

Content.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
};

Content.defaultProps = {
  component: 'main',
  className: undefined,
  children: undefined,
  title: undefined,
};

export default Content;
