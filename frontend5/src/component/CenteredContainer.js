import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const CenteredContainer = ({ children }) => {
  return (
    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column', height: '100vh' }}>
      {children}
    </Box>
  );
};

CenteredContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredContainer;