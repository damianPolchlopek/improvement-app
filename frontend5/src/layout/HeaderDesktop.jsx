import React from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from './Logo';

function HeaderDesktop({ pages, subPages }) {
  const [anchorElDropdown, setAnchorElDropdown] = React.useState({});

  const handleOpenDropdownMenu = (event, page) => {
    setAnchorElDropdown((prev) => ({ ...prev, [page]: event.currentTarget }));
  };

  const handleCloseDropdownMenu = (page) => {
    setAnchorElDropdown((prev) => ({ ...prev, [page]: null }));
  };

  return (
    <Box sx={{ flexGrow: 1,  display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Logo />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {pages.map((page) => (
          <Box key={page}>
            <Button
              onClick={(event) => handleOpenDropdownMenu(event, page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
            <Menu
              anchorEl={anchorElDropdown[page]}
              open={Boolean(anchorElDropdown[page])}
              onClose={() => handleCloseDropdownMenu(page)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {subPages[page].map((subPage) => (
                <MenuItem
                  key={subPage.name}
                  onClick={() => handleCloseDropdownMenu(page)}
                  component={Link}
                  to={subPage.path}
                >
                  <Typography textAlign="center">{subPage.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HeaderDesktop;
