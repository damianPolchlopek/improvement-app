import * as React from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import Logo from './Logo';

import { useTranslation } from 'react-i18next';
import { MENU_ITEMS as menuItems } from './MenuItems'; 

const category_style = { 
  py: 2, 
  px: 3, 
  color: 'rgba(255, 255, 255, 0.7)',
}

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

export default function DrawerComponent(props) {
  const { t } = useTranslation();

  return (
    <Drawer {...props}>
      <List disablePadding>
        <ListItem sx={{ ...item, px: 8, py: 2, fontSize: 22, color: '#fff' }}>
          <Logo />
        </ListItem>
        {menuItems(t).map(({ category, subPages, icon }) => (
          <Box key={category} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{...category_style}}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText sx={{ color: '#fff' }}>{category}</ListItemText>
            </ListItem>
            {subPages.map(({ name, icon, path }) => (
              <ListItem disablePadding key={name}>
                <ListItemButton sx={item} href={path}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

