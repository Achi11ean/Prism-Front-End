import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';
import { useAuth } from '../AuthContext';

function SignOut() {
  const { setIsSignedIn } = useAuth();
  const navigate = useNavigate();
  const isSignOutPerformed = useRef(false); // Ref to ensure sign out happens only once

  useEffect(() => {
    // Define an asynchronous function to handle sign-out
    const performSignOut = async () => {
      if (isSignOutPerformed.current) return; // Prevent repeated sign out calls

      isSignOutPerformed.current = true; // Mark that sign out is performed

      try {
        const response = await fetch('/api/signout', {
          method: 'POST',
          credentials: 'include', // Important for sending cookies/session data
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Sign out successful:', data);

          setIsSignedIn(false); // Update authentication state
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
  }, [navigate, setIsSignedIn]); // Add setIsSignedIn to the dependency array

  return (
    <span className="signout">
      <div className="signout-container">
        <p>Signing out...</p>
      </div>
    </span>
  );
}

export default SignOut;