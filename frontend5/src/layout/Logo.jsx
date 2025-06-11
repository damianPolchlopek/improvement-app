import React from 'react';
import appLogo from '../assets/logo.png';
import { HomeViewUrl } from '../utils/URLHelper';

import { Box } from '@mui/material';

const Logo = () => (
  <Box component="div" sx={{ width: '50px' }}>
    <a href={HomeViewUrl}>
      <img src={appLogo} alt="MyApp" />
    </a>
  </Box>
);

export default Logo;