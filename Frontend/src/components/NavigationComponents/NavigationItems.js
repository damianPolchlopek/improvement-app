import React from 'react';

const navigationItems = () => (
    <div>
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item text-muted">
                <a className="nav-link" href="/">
                    <h5>Home</h5>
                </a>
            </li>

            <li className="nav-item text-muted">
                <a className="nav-link" href="/diet">
                    <h5>Diet</h5>
                </a>
            </li>

            <li className="nav-item text-muted">
                <a className="nav-link" href="/training">
                    <h5>Training</h5>
                </a>
            </li>


            <li className="nav-item text-muted">
                <a className="nav-link" href="/printout-training">
                    <h5>View Training</h5>
                </a>
            </li>
        </ul>
    </div>
);

export default navigationItems;