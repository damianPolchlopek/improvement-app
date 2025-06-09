import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}