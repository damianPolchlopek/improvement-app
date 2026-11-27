import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { getRefreshTokenDuration } from '../login/Authentication.js';
import { Outlet, useLoaderData, useNavigate, useSubmit } from 'react-router-dom';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import Drawer from './Drawer.jsx';
import TokenRefreshNotification from '../login/TokenRefreshNotification.jsx';
import PageLoader from '../component/loader/PageLoader.jsx';

// setTimeout przyjmuje maks. ~24,8 dnia; dłuższe opóźnienie odpaliłoby się od razu
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();

  // Access token odświeża interceptor 401 w REST.js (refresh + ponowienie requestu).
  // Tu zostaje tylko koniec całej sesji: gdy znamy czas wygaśnięcia refresh tokenu,
  // wylogowujemy w tym momencie, żeby bezczynna karta nie wisiała w "zalogowanym" stanie.
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return undefined;
    }

    const sessionLeft = getRefreshTokenDuration();
    if (sessionLeft <= 0) return undefined; // czas nieznany → zdecyduje interceptor

    const id = setTimeout(
      () => submit(null, { action: '/logout', method: 'post' }),
      Math.min(sessionLeft, MAX_TIMEOUT_MS)
    );
    return () => clearTimeout(id);
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
          {/* Granica tylko wokół treści: leniwa strona ładuje się pod nagłówkiem i menu */}
          <Suspense fallback={<PageLoader minHeight="60dvh" />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
