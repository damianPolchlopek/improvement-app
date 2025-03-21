import * as React from 'react';

import Box from '@mui/material/Box';
import Header from './Header.jsx';
import { Outlet } from "react-router-dom";
import Drawer from './Drawer.jsx';

export default function Layout() {
  const [ mobileOpen, setMobileOpen ] = React.useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen((prevValue) => !prevValue);
  };

  return (
    <Box sx={{ display: 'flex', flex: '100vh' }}>
       
      <Drawer
        PaperProps={{ style: { width: 200 } }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      />

      <Box sx={{ flex: 1}}>
        <Header onDrawerToggle={handleDrawerToggle}/>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4}}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}