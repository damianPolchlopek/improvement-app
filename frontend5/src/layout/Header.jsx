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

import { useSubmit } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Stabilny `key` steruje logiką (logout), `label` jest tłumaczony
const settings = (t) => [
  { key: 'profile', label: t('header.profile') },
  { key: 'settings', label: t('menu.settings') },
  { key: 'logout', label: t('header.logout') },
];

function ResponsiveAppBar({ onDrawerToggle }) {
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
    submit(null, { method: 'post', action: '/logout' });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HeaderMobile onDrawerToggle={onDrawerToggle} />

          <HeaderDesktop />

          <LanguageSwitcher />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('header.openSettings')}>
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
              {settings(t).map(({ key, label }) => (
                <MenuItem key={key} onClick={key === 'logout' ? handleLogout : handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{label}</Typography>
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
