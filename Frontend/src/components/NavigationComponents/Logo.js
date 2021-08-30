import React from 'react';

import appLogo from '../../assets/app-logo.png';

const divStyle = {
    backgroundColor: 'grey',
    padding: '4px',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    cursor: 'pointer',
};

const imgStyle = {
    height: '100%'
};

const Logo = (props) => (
    <div className="mr-auto" style={divStyle}>
        <a href="/">
            <img src={appLogo} alt="MyApp" style={imgStyle}/>
        </a>
    </div>
);

export default Logo;