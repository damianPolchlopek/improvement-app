import * as React from 'react';
import { useEffect, useState } from 'react';
import { getTokenDuration, getAuthToken } from '../login/Authentication.js';
import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import Drawer from './Drawer.jsx';

export default function Layout() {
  const [ mobileOpen, setMobileOpen ] = useState(false);
  const token = useLoaderData();
  const submit = useSubmit();
  
  useEffect(() => {
    if (!token) {
      submit(null, { action: '/login', method: 'post' });
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);

  }, [token, submit]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevValue) => !prevValue);
  };

  return (
    <Box sx={{ display: 'flex', flex: '100vh' }}>
       
      <Drawer
        PaperProps={{ style: { width: 200 } }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      />

      <Box sx={{ flex: 1}}>
        { token !== null ? <Header onDrawerToggle={handleDrawerToggle}/> : null}
        <Box component="main" sx={{ flex: 1, py: 6, px: 4}}>
          <Outlet />
        </Box>
      </Box>
      
    </Box>
  );
}