import React from 'react';

import Content from '../components/Content';

import reactLogoPath from '../images/react-logo.png';

const HomePage = () => (
  <Content>
    <h2>Home page</h2>

    <p>
      <img src={reactLogoPath} alt="React logo" />
    </p>
  </Content>
);

export default HomePage;
