import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import PageLoader from '../component/loader/PageLoader.jsx';

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
}
