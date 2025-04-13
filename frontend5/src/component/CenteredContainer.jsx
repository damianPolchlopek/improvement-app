import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const CenteredContainer = ({ children }) => {
  return (
    <Box style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: "center", 
      flexDirection: 'column', 
    }}>
      {children}
    </Box>
  );
};

CenteredContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredContainer;