import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';


function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false); // Function to close the menu
    };
    return (
        <nav>
            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? 'Close Menu' : 'Open Menu'}
            </button>
            <ul className={menuOpen ? 'open' : ''}>                
                <li><Link to="/">Home</Link></li>
                <li><Link to="/venues" onClick={closeMenu}>Venues</Link></li>
                <li><Link to="/artists" onClick={closeMenu}>Artists</Link></li>
                <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
                <li><Link to="/tours" onClick={closeMenu}>Tours</Link></li>
                <li><Link to="/attendees" onClick={closeMenu}>Attendees</Link></li>
                <li><Link to='/SignIn' onClick={closeMenu} className="signin">Sign In</Link></li>
                <li><Link to='/SignOut' onClick={closeMenu} className="signout">Sign Out</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar