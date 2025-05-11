import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// A wrapper component to handle protected routes
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state while Firebase is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to sign-in
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};

export default PrivateRoute;
