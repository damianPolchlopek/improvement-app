import './Layout.css';

import Logo from './Logo';
import NavigationItems from './NavigationItems';

function Layout(props) {
  return (
    <div>
    
      <div className="layout">
        <Logo />
        <NavigationItems />
      </div>    

      <main>
        {props.children}
      </main>

    </div>
  );
}

export default Layout;
