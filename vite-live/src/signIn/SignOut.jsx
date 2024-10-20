// src/signin/SignOut.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    // Define an asynchronous function to handle sign-out
    const performSignOut = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/signout', {
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
          alert('Failed to sign out. Please try again.');
          // Optionally, redirect to an error page or stay on the current page
        }
      } catch (error) {
        console.error('Error during sign out:', error);
        // Optionally, redirect to an error page or stay on the current page
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
