import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';

import AccountCircle from '@mui/icons-material/AccountCircle';
import Logo from './Logo';

export default function NavigationItems() {
  
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

            <Button color="inherit" href="/">Home</Button>
            <Button color="inherit" href="/add-training">Add Training</Button>
            <Button color="inherit" href="/view-training">View Training</Button>
            <Button color="inherit" href="/shopping-list">Shopping List</Button>
            <Button color="inherit" href="/product-list">Product List</Button>
            
          </Typography>

          <AccountCircle />
          <Button color="inherit"href="/login-panel">Login</Button>


          {/* https://mui.com/#app-bar-with-menu */}
          {/* <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu> */}
        </Toolbar>
      </AppBar>
    </Box>
  );

}
