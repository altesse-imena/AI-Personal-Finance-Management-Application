import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userProfileService, transactionService, goalService } from '../services/financeService';

// Create the context
const FinanceContext = createContext();

// Custom hook to use the finance context
export const useFinance = () => useContext(FinanceContext);

// Finance provider component
export const FinanceProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      console.log('Firebase config:', {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing'
      });
      
      // Try to access Firestore to verify connection
      // Use a direct Firestore collection check that doesn't require authentication
      const db = await import('../utils/firebase').then(module => module.db);
      const { collection, getDocs, limit, query } = await import('firebase/firestore');
      
      // Just try to access any collection to test connection
      const testQuery = query(collection(db, 'system_health'), limit(1));
      await getDocs(testQuery);
      
      console.log('Firebase connection successful');
      return true;
    } catch (error) {
      console.error('Firebase connection error:', error);
      return false;
    }
  };

  // Test Firebase connection on component mount
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        await testFirebaseConnection();
      } catch (error) {
        console.error('Initial Firebase connection check failed:', error);
      }
    };
    
    checkFirebaseConnection();
  }, []); // Run once on component mount

  // Load user profile data when the user is signed in
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoaded) {
        // Still loading Clerk user data
        return;
      }
      
      if (!isSignedIn || !user) {
        // User is not signed in, but we've finished loading
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {        
        // Get user profile or initialize if it doesn't exist
        let profile = await userProfileService.getUserProfile(user.id);
        
        if (!profile) {
          profile = await userProfileService.initializeUserProfile(user.id, {
            displayName: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
          });
        }
        
        setUserProfile(profile);

        // Get user transactions
        const userTransactions = await transactionService.getTransactions(user.id, {
          limit: 20 // Get the 20 most recent transactions
        });
        setTransactions(userTransactions);

        // Get user goals
        const userGoals = await goalService.getGoals(user.id);
        setGoals(userGoals);

      } catch (err) {
        console.error('Error loading user financial data:', err);
        setError('Failed to load your financial data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isLoaded, isSignedIn, user]);

  // Function to add a new transaction
  const addTransaction = async (transactionData) => {
    if (!user) return null;
    
    try {
      const newTransaction = await transactionService.addTransaction(user.id, transactionData);
      
      // Update transactions list
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update financial summary based on transaction type
      if (userProfile) {
        const summary = { ...userProfile.financialSummary };
        
        if (transactionData.type === 'income') {
          summary.income += Number(transactionData.amount);
          summary.balance += Number(transactionData.amount);
        } else if (transactionData.type === 'expense') {
          summary.expenses += Number(transactionData.amount);
          summary.balance -= Number(transactionData.amount);
        }
        
        // Update user profile with new summary
        await userProfileService.updateFinancialSummary(user.id, summary);
        setUserProfile(prev => ({
          ...prev,
          financialSummary: summary
        }));
      }
      
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      return null;
    }
  };

  // Function to add a new goal
  const addGoal = async (goalData) => {
    if (!user) return null;
    
    try {
      const newGoal = await goalService.addGoal(user.id, goalData);
      
      // Update goals list
      setGoals(prev => [...prev, newGoal]);
      
      return newGoal;
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal. Please try again.');
      return null;
    }
  };

  // Function to update goal progress
  const updateGoalProgress = async (goalId, amount) => {
    if (!user) return null;
    
    try {
      const updatedGoal = await goalService.updateGoalProgress(goalId, amount);
      
      // Update goals list
      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? updatedGoal : goal)
      );
      
      return updatedGoal;
    } catch (err) {
      console.error('Error updating goal progress:', err);
      setError('Failed to update goal progress. Please try again.');
      return null;
    }
  };

  // Function to update user profile
  const updateProfile = async (profileData) => {
    if (!user) return null;
    
    try {
      const updatedProfile = await userProfileService.updateUserProfile(user.id, profileData);
      
      // Update user profile state
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      return null;
    }
  };

  // Calculate financial insights
  const getInsights = () => {
    if (!transactions.length) return null;
    
    // Calculate spending by category
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Number(transaction.amount);
        return acc;
      }, {});
    
    // Calculate income by category
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Number(transaction.amount);
        return acc;
      }, {});
    
    // Calculate monthly spending trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySpending = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= sixMonthsAgo)
      .reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += Number(transaction.amount);
        return acc;
      }, {});
    
    return {
      spendingByCategory,
      incomeByCategory,
      monthlySpending
    };
  };

  // Value to be provided by the context
  const value = {
    userProfile,
    transactions,
    goals,
    isLoading,
    error,
    addTransaction,
    addGoal,
    updateGoalProgress,
    updateProfile,
    getInsights,
    testFirebaseConnection,
    refreshTransactions: async () => {
      if (!user) return;
      const userTransactions = await transactionService.getTransactions(user.id);
      setTransactions(userTransactions);
    },
    refreshGoals: async () => {
      if (!user) return;
      const userGoals = await goalService.getGoals(user.id);
      setGoals(userGoals);
    }
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceProvider;
