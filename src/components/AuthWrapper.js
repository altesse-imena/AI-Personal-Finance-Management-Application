import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

// A wrapper component to handle protected routes
const AuthWrapper = ({ children, requireAuth = true }) => {
  const { isSignedIn, isLoaded } = useUser();
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // For protected routes: if not signed in, redirect to sign-in
  if (requireAuth && !isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // For public-only routes (like sign-in): if signed in, redirect to dashboard
  if (!requireAuth && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};

export default AuthWrapper;
