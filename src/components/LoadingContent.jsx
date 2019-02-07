import React from 'react';
import PropTypes from 'prop-types';

import Content from './Content';
import Button from './Button';

const LoadingContent = ({ error, retry, pastDelay }) => {
  if (error) {
    return (
      <Content>
        <h1>Error!</h1>

        <Button type="button" onClick={retry}>
          Retry
        </Button>
      </Content>
    );
  }

  if (pastDelay) {
    return (
      <Content>
        <h1>Loading...</h1>
      </Content>
    );
  }

  return null;
};

LoadingContent.propTypes = {
  error: PropTypes.instanceOf(Error),
  retry: PropTypes.func.isRequired,
  pastDelay: PropTypes.bool.isRequired,
};

LoadingContent.defaultProps = {
  error: undefined,
};

export default LoadingContent;
