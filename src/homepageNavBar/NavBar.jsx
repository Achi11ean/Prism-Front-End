import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';


function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <nav>
            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? 'Close Menu' : 'Open Menu'}
            </button>
            <ul className={menuOpen ? 'open' : ''}>                
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