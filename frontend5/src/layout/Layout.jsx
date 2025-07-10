import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { getTokenDuration, getRefreshToken, refreshAccessToken } from '../login/Authentication.js';
import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import Drawer from './Drawer.jsx';
import TokenRefreshNotification from '../login/TokenRefreshNotification.jsx';

export default function Layout() {
  const [ mobileOpen, setMobileOpen ] = useState(false);
  const token = useLoaderData();
  const submit = useSubmit();
  
  const logoutTimeoutRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) {
      submit(null, { action: '/login', method: 'post' });
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log('Token duration: ', tokenDuration)

    // Ustaw timeout na wylogowanie
    logoutTimeoutRef.current = setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);

    // Cleanup function
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, [token, submit]);

  useEffect(() => {
    if (!token || token === 'EXPIRED') {
      return;
    }

    const scheduleTokenRefresh = () => {
      // Wyczyść poprzedni timeout jeśli istnieje
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const tokenDuration = getTokenDuration();
      const refreshToken = getRefreshToken();

      if (tokenDuration <= 0 || !refreshToken || refreshToken === 'EXPIRED') {
        return;
      }

      // Odśwież token 5 minut przed wygaśnięciem (300000ms = 5 minut)
      const refreshTime = Math.max(tokenDuration - 300000, 0);

      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            console.log('Attempting to refresh token...');
            const newToken = await refreshAccessToken();
            console.log('Token refreshed successfully');
            
            // Opcja 1: Przeładuj stronę (prostsze)
            // window.location.reload();
            
            // Opcja 2: Możesz też spróbować zaktualizować stan bez przeładowania
            // submit(null, { action: '/refresh-token', method: 'post' });
            
          } catch (error) {
            console.error('Failed to refresh token:', error);
            submit(null, { action: '/logout', method: 'post' });
          }
        }, refreshTime);
      }
    };

    scheduleTokenRefresh();

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [token, submit]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevValue) => !prevValue);
  };

  return (
    <Box sx={{ display: 'flex', flex: '100vh' }}>
      <TokenRefreshNotification />
       
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