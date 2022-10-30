import React from 'react';
import './NavigationItems.css';

const NavigationItems = () => (
    <div className="nav-div">
      <ul className="navigation">
        <li><a href="/">Home</a></li>
        <li><a href="/add-training">Add Training</a></li>
        <li><a href="/view-training">View Training</a></li>
        <li><a href="/shopping-list">Shopping List</a></li>
        <li><a href="/product-list">Product List</a></li>
        <li><a href="/test">test</a></li>
        <li><a href="/login-panel">Login</a></li>
      </ul>
    </div>
);

export default NavigationItems;