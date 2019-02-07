import React from 'react';

import Content from '../components/Content';

import reactLogoPath from '../images/react-logo.png';

const HomePage = () => (
  <Content title="Home">
    <h1>Home page</h1>

    <p>
      <img src={reactLogoPath} alt="React logo" />
    </p>
  </Content>
);

export default HomePage;
