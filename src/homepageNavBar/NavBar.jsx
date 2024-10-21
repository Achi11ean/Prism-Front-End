import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    return (
        <nav>
            <ul>
                
                <li><Link to="/">Home</Link></li>
                <li><Link to="/venues">Venues</Link></li>
                <li><Link to="/artists">Artists</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/tours">Tours</Link></li>
                <li><Link to="/attendees">Attendees</Link></li>
                <li><Link to='/SignIn' className="signin">Sign In</Link></li>
                <li><Link to='/SignOut' className="signout">Sign Out</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar