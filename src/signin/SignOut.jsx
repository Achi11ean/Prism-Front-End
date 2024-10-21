// src/signin/SignOut.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

function SignOut() {
  const navigate = useNavigate();
  const isSignOutPerformed = useRef(false); // Ref to ensure sign out happens only once

  useEffect(() => {
    // Define an asynchronous function to handle sign-out
    const performSignOut = async () => {
      if (isSignOutPerformed.current) return; // Prevent repeated sign out calls

      isSignOutPerformed.current = true; // Mark that sign out is performed

      try {
        const response = await fetch('https://phase4project-xp0u.onrender.com/signout', {
          method: 'POST',
          credentials: 'include', // Important for sending cookies/session data
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Sign out successful:', data);

          alert('You have been successfully signed out.');

          // Redirect to the home page or login page after sign out
          navigate('/');
        } else {
          const errorData = await response.json();
          console.error('Sign out failed:', errorData);
        }
      } catch (error) {
        console.error('Error during sign out:', error);
      }
    };

    performSignOut();
  }, [navigate]);

  return (
    <span className="signout">
      <div className="signout-container">
        <p>Signing out...</p>
      </div>
    </span>
  );
}

export default SignOut;
