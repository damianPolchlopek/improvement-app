import React from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function HeaderMobile({ onDrawerToggle }) {
  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        aria-label="open navigation"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onDrawerToggle}
        color="inherit"
        edge="start"
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}

export default HeaderMobile;
