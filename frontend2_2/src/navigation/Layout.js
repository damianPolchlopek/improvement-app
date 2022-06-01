import React from 'react';
import './Layout.css';

import Logo from './Logo';
import NavigationItems from './NavigationItems';

function Layout(props) {
  return (
    <div>
    
      <div className='topBar'>
        <Logo />
        <NavigationItems />
      </div>    

      <main className='body'>
        {props.children}
      </main>

    </div>
  );
}

export default Layout;
