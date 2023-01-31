import React from 'react';
import appLogo from '../assets/app-logo.png';

const Logo = () => (
  <div>
    <a href="/">
      <img src={appLogo} alt="MyApp" />
    </a>
  </div>
);

export default Logo;