import React from 'react';
import { Box, ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';

// Górny poziom toolbara: zakładki modułów. Kliknięcie otwiera pierwszą podstronę modułu,
// a resztę podstron pokazuje SubNavigation pod spodem (bez dropdownów).
function HeaderDesktop({ items, activeModule }) {
  return (
    <Box
      component="nav"
      sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch', alignSelf: 'stretch' }}
    >
      {items.map((module) => {
        const active = module === activeModule;
        return (
          <ButtonBase
            key={module.category}
            component={Link}
            to={module.subPages[0].path}
            aria-current={active ? 'page' : undefined}
            sx={{
              px: 1.75,
              gap: 1,
              fontSize: 14,
              fontWeight: 500,
              color: active ? 'text.primary' : 'toolbar.text',
              boxShadow: active
                ? (theme) => `inset 0 -2px 0 ${theme.palette.toolbar.indicator}`
                : 'none',
              transition: 'color .15s, background-color .15s',
              '& svg': { fontSize: 18 },
              '&:hover': { color: 'text.primary', bgcolor: 'toolbar.hover' },
            }}
          >
            {module.icon}
            {module.category}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default HeaderDesktop;
