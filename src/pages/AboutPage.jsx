import React from 'react';
import { Link } from 'react-router-dom';

import classes from './AboutPage.scss';

import Content from '../components/Content';

const AboutPage = () => (
  <Content title="About" className={classes.content}>
    <h2>About page</h2>

    <p>
      <Link to="/">Back to home</Link>
    </p>
  </Content>
);

export default AboutPage;
