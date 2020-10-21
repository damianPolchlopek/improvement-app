import React from 'react';
import NavigationItems from '../NavigationItems';
import DrawerToggle from '../DrawerToggle';
import Logo from '../Logo';
import './Toolbar.css';

const toolbar = ( props ) => (
    <div>
        <nav class="container navbar-expand-lg navbar-dark bg-dark ">
            <button class="navbar-toggler" type="button" data-toggle="drawer" data-target="#navbarTogglerDemo01" >
                <DrawerToggle class="navbar-expand-sm" clicked={props.drawerToggleClicked} />
            </button>
            
            <div class="collapse navbar-collapse"> 
                <Logo />
                <NavigationItems />
            </div>
        </nav>
    </div>
);

export default toolbar;