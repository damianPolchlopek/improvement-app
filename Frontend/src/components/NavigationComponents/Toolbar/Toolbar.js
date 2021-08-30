import React from 'react';
import NavigationItems from '../NavigationItems';
import DrawerToggle from '../DrawerToggle';
import Logo from '../Logo';
import './Toolbar.css';

const toolbar = ( props ) => (
    <div>
        <nav className="container navbar-expand-lg navbar-dark bg-dark ">
            <button className="navbar-toggler" type="button" data-toggle="drawer" data-target="#navbarTogglerDemo01" >
                <DrawerToggle class="navbar-expand-sm" clicked={props.drawerToggleClicked} />
            </button>
            
            <div className="collapse navbar-collapse"> 
                <Logo />
                <NavigationItems />
            </div>
        </nav>
    </div>
);

export default toolbar;