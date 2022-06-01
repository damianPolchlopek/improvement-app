import React from 'react';
import './NavigationItems.css';

const NavigationItems = () => (
    <div className="nav-div">
      <ul className="navigation">
        <li><a href="/">Home</a></li>
        <li><a href="/add-training">Add Training</a></li>
        <li><a href="/view-training">View Training</a></li>
        <li><a href="/login-panel">Login</a></li>
      </ul>
    </div>
);

export default NavigationItems;