import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  SignIn, 
  SignUp 
} from '@clerk/clerk-react';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthWrapper from './components/AuthWrapper';

// Import custom Clerk appearance
import clerkAppearance from './utils/clerkAppearance';

// Import pages
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';



function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/sign-in/*" 
            element={
              <AuthWrapper requireAuth={false}>
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
                  <div className="w-full max-w-md">
                    <SignIn 
                      routing="path" 
                      path="/sign-in" 
                      appearance={clerkAppearance}
                      redirectUrl="/dashboard"
                      signUpUrl="/sign-up"
                    />
                  </div>
                </div>
              </AuthWrapper>
            } 
          />
          <Route 
            path="/sign-up/*" 
            element={
              <AuthWrapper requireAuth={false}>
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
                  <div className="w-full max-w-md">
                    <SignUp 
                      routing="path" 
                      path="/sign-up" 
                      appearance={clerkAppearance}
                      redirectUrl="/dashboard"
                      signInUrl="/sign-in"
                    />
                  </div>
                </div>
              </AuthWrapper>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <AuthWrapper requireAuth={true}>
                <Dashboard />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/goals" 
            element={
              <AuthWrapper requireAuth={true}>
                <Goals />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <AuthWrapper requireAuth={true}>
                <Transactions />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/transactions/new" 
            element={
              <AuthWrapper requireAuth={true}>
                <AddTransaction />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <AuthWrapper requireAuth={true}>
                <Insights />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AuthWrapper requireAuth={true}>
                <Settings />
              </AuthWrapper>
            } 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
