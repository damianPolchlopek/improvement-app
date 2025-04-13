import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import LanguageSwitcher from '../language/LanguageSwitcher';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

import { useTranslation } from 'react-i18next';
import { useSubmit } from 'react-router-dom';

const settings = ( t ) => ['Profile', 'Settings', 'Logout'];

function ResponsiveAppBar({onDrawerToggle}) {
  const submit = useSubmit();
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log('User logged out');
    submit(null, { method: 'post', action: '/logout' });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <HeaderMobile
            onDrawerToggle={onDrawerToggle}
          />
          
          <HeaderDesktop />
          
          <LanguageSwitcher />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="D" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings(t).map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === 'Logout' ? handleLogout : handleCloseUserMenu
                  }
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;