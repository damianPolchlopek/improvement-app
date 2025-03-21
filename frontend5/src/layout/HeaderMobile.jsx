import React from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function HeaderMobile({ onDrawerToggle }) {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onDrawerToggle}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}

export default HeaderMobile;
