import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in status
  const [user, setUser] = useState(null); // Store user details

  // Function to handle sign-in
  const signIn = (userData) => {
    setIsSignedIn(true);
    setUser(userData); // Set user data on sign-in
  };

  // Function to handle sign-out
  const signOut = () => {
    setIsSignedIn(false);
    setUser(null); // Clear user data on sign-out
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);