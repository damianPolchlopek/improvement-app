import React from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from './Logo';

import { useTranslation } from 'react-i18next';
import { MENU_ITEMS as menuItems } from './MenuItems'; 

function HeaderDesktop() {
  const [anchorElDropdown, setAnchorElDropdown] = React.useState({});
  const { t } = useTranslation();

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
        {menuItems(t).map(({ category, subPages }) => (
          <Box key={category}>
            <Button
              onClick={(event) => handleOpenDropdownMenu(event, category)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {category}
            </Button>
            <Menu
              anchorEl={anchorElDropdown[category]}
              open={Boolean(anchorElDropdown[category])}
              onClose={() => handleCloseDropdownMenu(category)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {subPages.map((subPage) => (
                <MenuItem
                  key={subPage.name}
                  onClick={() => handleCloseDropdownMenu(category)}
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
