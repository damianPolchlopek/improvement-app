import React from 'react';
import "./Logo.css"
import appLogo from '../assets/app-logo.png';

const Logo = (props) => (
    <div className="logo">
      <a href="/">
        <img 
            src={appLogo} 
            alt="MyApp" 
            className="image"/>
      </a>
    </div>
);

export default Logo;