import React from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/logo.png';
import { HomeViewUrl } from '../utils/URLHelper';

import { Box } from '@mui/material';

const Logo = ({ size = 50 }) => (
  <Box
    component={Link}
    to={HomeViewUrl}
    sx={{ display: 'flex', width: size, height: size, flexShrink: 0 }}
  >
    <Box
      component="img"
      src={appLogo}
      alt="MyApp"
      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </Box>
);

export default Logo;
