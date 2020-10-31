import React from 'react';

const navigationItems = () => (
    <div>
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item text-muted">
                <a class="nav-link" href="/">
                    <h5>Home</h5>
                </a>
            </li>

            <li class="nav-item text-muted">
                <a class="nav-link" href="/diet">
                    <h5>Diet</h5>
                </a>
            </li>

            <li class="nav-item text-muted">
                <a class="nav-link" href="/training">
                    <h5>Training</h5>
                </a>
            </li>
        </ul>
    </div>
);

export default navigationItems;