import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useAuth } from "../AuthContext";



function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn, user } = useAuth(); // Destructure isSignedIn and user from useAuth
    console.log('USER IS: ', user)

    useEffect(() => {
        console.log('Is Signed In:', isSignedIn);
        console.log('User:', user);
    }, [isSignedIn, user]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav>
            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? 'Close Menu' : 'Open Menu'}
            </button>
            <ul className={menuOpen ? 'open' : ''}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                
                {isSignedIn && (
                    <>
                        <li><Link to="/venues" onClick={closeMenu}>Venues</Link></li>
                        <li><Link to="/artists" onClick={closeMenu}>Artists</Link></li>
                        <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
                        <li><Link to="/tours" onClick={closeMenu}>Tours</Link></li>
                        <li><Link to="/attendees" onClick={closeMenu}>Attendees</Link></li>
                        {user && user.user_type === 'admin' && ( // Conditional rendering for admin link

                        <li>
                        <Link to="/admin/users">Admin</Link>
                        </li>
                        )}
                    </>
                )}
                
                {!isSignedIn ? (
                    <li><Link to="/SignIn" onClick={closeMenu} className="signin">Sign In</Link></li>
                ) : (
                    <li><Link to="/SignOut" onClick={closeMenu} className="signout">Sign Out</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;