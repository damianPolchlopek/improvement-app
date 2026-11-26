import React from 'react';
import { Box, Button, Container, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

import { isPathActive } from './MenuItems';

const linkSx = (active) => ({
  flexShrink: 0,
  px: 1.25,
  py: 0.25,
  minWidth: 0,
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: active ? 'text.primary' : 'toolbar.text',
  bgcolor: active ? 'toolbar.subSelected' : 'transparent',
  '&:hover': { color: 'text.primary', bgcolor: active ? 'toolbar.subSelected' : 'toolbar.hover' },
});

const quickActionSx = {
  flexShrink: 0,
  px: 1.5,
  py: 0.25,
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: 'toolbar.accent',
  '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' },
};

// Dolny poziom toolbara: podstrony aktywnego modułu. Moduły z jedną podstroną
// (np. Strona główna) nie potrzebują tego paska, więc wtedy go nie renderujemy.
function SubNavigation({ pathname, module }) {
  if (!module || module.subPages.length < 2) return null;

  const pages = module.subPages.filter((page) => !page.quickAction);
  const quickActions = module.subPages.filter((page) => page.quickAction);

  return (
    <Box
      sx={{
        bgcolor: 'toolbar.subBackground',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          component="nav"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minHeight: 38,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {quickActions.map((page) => {
            const active = isPathActive(pathname, page.path);
            return (
              <Button
                key={page.path}
                component={Link}
                to={page.path}
                size="small"
                startIcon={page.icon}
                aria-current={active ? 'page' : undefined}
                sx={quickActionSx}
              >
                {page.name}
              </Button>
            );
          })}

          {quickActions.length > 0 && (
            <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 0.75 }} />
          )}

          {pages.map((page) => {
            const active = isPathActive(pathname, page.path);
            return (
              <Button
                key={page.path}
                component={Link}
                to={page.path}
                size="small"
                aria-current={active ? 'page' : undefined}
                sx={linkSx(active)}
              >
                {page.name}
              </Button>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

export default SubNavigation;
