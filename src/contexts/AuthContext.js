import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUser, 
  loginUser, 
  signInWithGoogle, 
  logoutUser, 
  getCurrentUser,
  onAuthStateChange,
  updateUserEmail,
  updateUserPassword
} from '../utils/firebase';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Authentication functions
  const signup = async (email, password) => {
    try {
      setError(null);
      return await registerUser(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      return await loginUser(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      return await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateEmail = async (newEmail) => {
    try {
      setError(null);
      await updateUserEmail(newEmail);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      await updateUserPassword(newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get the current authenticated user
  const getUser = () => {
    return getCurrentUser();
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    updateEmail,
    updatePassword,
    logout,
    getUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
