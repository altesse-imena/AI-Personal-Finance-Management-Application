import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { ThemeProvider } from './contexts/ThemeContext';

// Import pages
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';

// Import new feature pages
import Budget from './pages/Budget';
import Subscriptions from './pages/Subscriptions';
import FinancialHealth from './pages/FinancialHealth';
import RecurringTransactions from './pages/RecurringTransactions';



function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/sign-in" 
            element={
              <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
                <SignIn />
              </div>
            } 
          />
          <Route 
            path="/sign-up" 
            element={
              <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
                <SignUp />
              </div>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/goals" 
            element={
              <PrivateRoute>
                <Goals />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/transactions/new" 
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <PrivateRoute>
                <Insights />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          
          {/* New features */}
          <Route 
            path="/budget" 
            element={
              <PrivateRoute>
                <Budget />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/subscriptions" 
            element={
              <PrivateRoute>
                <Subscriptions />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/financial-health" 
            element={
              <PrivateRoute>
                <FinancialHealth />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recurring-transactions" 
            element={
              <PrivateRoute>
                <RecurringTransactions />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
      
      <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
