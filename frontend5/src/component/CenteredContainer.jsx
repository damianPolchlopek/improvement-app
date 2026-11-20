import React from 'react';
import { Box } from '@mui/material';

const CenteredContainer = ({ children }) => {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredContainer;
