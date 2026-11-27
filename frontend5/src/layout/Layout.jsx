import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { getTokenDuration, getRefreshToken, refreshAccessToken } from '../login/Authentication.js';
import { Outlet, useLoaderData, useNavigate, useSubmit } from 'react-router-dom';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import Drawer from './Drawer.jsx';
import TokenRefreshNotification from '../login/TokenRefreshNotification.jsx';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(useLoaderData());
  const submit = useSubmit();
  const navigate = useNavigate();

  const logoutTimeoutRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false); // Zapobiega wielokrotnym odświeżeniom

  // Główny useEffect do zarządzania tokenami.
  // Funkcje pomocnicze są zdefiniowane w środku, bo używa ich wyłącznie ten efekt
  // (i rekurencyjny setTimeout). Dzięki temu zależności to stabilne [token, submit, navigate].
  useEffect(() => {
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

      refreshTimeoutRef.current = setTimeout(async () => {
        if (isRefreshingRef.current) {
          return;
        }

        try {
          isRefreshingRef.current = true;

          const newToken = await refreshAccessToken();

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
        submit(null, { action: '/logout', method: 'post' });
      }, tokenDuration);
    };

    if (!token) {
      navigate('/login');
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
  }, [token, submit, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevValue) => !prevValue);
  };

  return (
    <Box sx={{ display: 'flex', flex: '100dvh' }}>
      <TokenRefreshNotification />

      <Drawer
        slotProps={{ paper: { style: { width: 200 } } }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* minWidth: 0 – bez tego szeroka tabela rozpycha element flex ponad ekran,
          zamiast przewijać się wewnątrz własnego TableContainera (ważne na telefonie). */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {token !== null ? <Header onDrawerToggle={handleDrawerToggle} /> : null}
        {/* Strony mają własny padding (px: 2, py: 3), więc na telefonie layout nie dokłada drugiego. */}
        <Box component="main" sx={{ flex: 1, py: { xs: 0, md: 6 }, px: { xs: 0, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
