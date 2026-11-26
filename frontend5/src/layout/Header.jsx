import * as React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import LanguageSwitcher from '../language/LanguageSwitcher';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';
import SubNavigation from './SubNavigation';
import Logo from './Logo';
import { MENU_ITEMS, findActiveModule } from './MenuItems';

import { useLocation, useSubmit } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Stabilny `key` steruje logiką (logout), `label` jest tłumaczony
const settings = (t) => [
  { key: 'profile', label: t('header.profile'), icon: <PersonIcon fontSize="small" /> },
  { key: 'settings', label: t('menu.settings'), icon: <SettingsIcon fontSize="small" /> },
  { key: 'logout', label: t('header.logout'), icon: <LogoutIcon fontSize="small" /> },
];

function ResponsiveAppBar({ onDrawerToggle }) {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const items = MENU_ITEMS(t);
  const activeModule = findActiveModule(items, pathname);

  const handleLogout = () => {
    submit(null, { method: 'post', action: '/logout' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: (theme) => theme.palette.toolbar.background,
        borderBottom: (theme) => theme.palette.toolbar.border,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 52 }, gap: 1 }}>
          <HeaderMobile onDrawerToggle={onDrawerToggle} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mr: { md: 2 } }}>
            <Logo size={30} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: 0.3, display: { xs: 'none', sm: 'block' } }}
            >
              Improvement
            </Typography>
          </Box>

          <HeaderDesktop items={items} activeModule={activeModule} />

          <Box sx={{ flexGrow: 1 }} />

          <LanguageSwitcher />

          <Tooltip title={t('header.openSettings')}>
            <IconButton onClick={(event) => setAnchorElUser(event.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: 'toolbar.selected', color: 'text.primary' }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            {settings(t).map(({ key, label, icon }) => (
              <MenuItem
                key={key}
                onClick={key === 'logout' ? handleLogout : () => setAnchorElUser(null)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <Typography variant="body2">{label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>

      <SubNavigation pathname={pathname} module={activeModule} />
    </AppBar>
  );
}
export default ResponsiveAppBar;
