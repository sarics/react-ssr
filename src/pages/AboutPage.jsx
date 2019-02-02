import React from 'react';
import { Link } from '@reach/router';

import Content from '../components/Content';

const AboutPage = () => (
  <Content title="About">
    <h2>About page</h2>

    <p>
      <Link to="/">Back to home</Link>
    </p>
  </Content>
);

export default AboutPage;
