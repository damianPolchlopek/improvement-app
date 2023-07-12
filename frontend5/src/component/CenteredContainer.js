import React from 'react';
import PropTypes from 'prop-types';

const CenteredContainer = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

CenteredContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredContainer;