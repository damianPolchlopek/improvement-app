import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { getTokenDuration, getRefreshToken, refreshAccessToken } from '../login/Authentication.js';
import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import Drawer from './Drawer.jsx';
import TokenRefreshNotification from '../login/TokenRefreshNotification.jsx';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(useLoaderData());
  const submit = useSubmit();
  
  const logoutTimeoutRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false); // Zapobiega wielokrotnym odświeżeniom

  const clearAllTimeouts = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  };

  const scheduleTokenRefresh = (currentToken) => {
    if (!currentToken || currentToken === 'EXPIRED') return;
    
    clearAllTimeouts();
    
    const tokenDuration = getTokenDuration();
    const refreshToken = getRefreshToken();
        
    if (tokenDuration <= 0 || !refreshToken || refreshToken === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    // Odśwież token 5 minut przed wygaśnięciem
    const refreshTime = Math.max(tokenDuration - 300000, 60000); // Minimum 1 minuta
    
    console.log('Scheduling refresh in:', refreshTime, 'ms');
    
    refreshTimeoutRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) {
        console.log('Already refreshing, skipping...');
        return;
      }
      
      try {
        isRefreshingRef.current = true;
        console.log('Attempting to refresh token...');
        
        const newToken = await refreshAccessToken();
        console.log('Token refreshed successfully');
        
        // Aktualizuj lokalny stan zamiast przeładowywać stronę
        setToken(newToken);
        
        // Zaplanuj następne odświeżenie
        scheduleTokenRefresh(newToken);
        
      } catch (error) {
        console.error('Failed to refresh token:', error);
        submit(null, { action: '/logout', method: 'post' });
      } finally {
        isRefreshingRef.current = false;
      }
    }, refreshTime);

    // Ustaw timeout na wylogowanie jako backup
    logoutTimeoutRef.current = setTimeout(() => {
      console.log('Token expired, logging out');
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  };

  // Główny useEffect do zarządzania tokenami
  useEffect(() => {
    if (!token) {
      submit(null, { action: '/login', method: 'post' });
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    scheduleTokenRefresh(token);

    // Cleanup
    return () => {
      clearAllTimeouts();
      isRefreshingRef.current = false;
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
        {token !== null ? <Header onDrawerToggle={handleDrawerToggle}/> : null}
        <Box component="main" sx={{ flex: 1, py: 6, px: 4}}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}