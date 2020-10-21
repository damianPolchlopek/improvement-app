import React, { Component } from 'react';

import Toolbar from './Toolbar/Toolbar';
import NavigationItems from '../NavigationComponents/NavigationItems';
import Logo from './Logo';

class Layout extends Component {
    state = {
        showSideDrawer: false
    };

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    };

    render () {
        return (
            <div class="bmd-layout-container bmd-drawer-f-l bmd-drawer-overlay">
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />

                <div id="navbarTogglerDemo01" class="bmd-layout-drawer bg-faded">
                    <header>
                        <Logo/>
                    </header>
                    <NavigationItems />
                </div>

                <main>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

export default Layout;
