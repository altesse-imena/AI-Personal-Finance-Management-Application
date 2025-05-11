import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
// Import mock services instead of Firebase services to bypass permission errors
// import { userProfileService, transactionService, goalService } from '../services/financeService';
import { mockUserProfileService as userProfileService, mockTransactionService as transactionService, mockGoalService as goalService } from '../services/mockDataService';

// Create the context
const FinanceContext = createContext();

// Custom hook to use the finance context
export const useFinance = () => useContext(FinanceContext);

// Finance provider component
export const FinanceProvider = ({ children }) => {
  const { currentUser, loading } = useAuth();
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
      if (loading) {
        // Still loading Firebase auth data
        return;
      }
      
      if (!currentUser) {
        // User is not signed in, but we've finished loading
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {        
        // Get user profile or initialize if it doesn't exist
        let profile = await userProfileService.getUserProfile(currentUser.uid);
        
        if (!profile) {
          profile = await userProfileService.initializeUserProfile(currentUser.uid, {
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
          });
        }
        
        setUserProfile(profile);

        // Get user transactions
        const userTransactions = await transactionService.getTransactions(currentUser.uid, {
          limit: 20 // Get the 20 most recent transactions
        });
        setTransactions(userTransactions);

        // Get user goals
        const userGoals = await goalService.getGoals(currentUser.uid);
        setGoals(userGoals);

      } catch (err) {
        console.error('Error loading user financial data:', err);
        setError('Failed to load your financial data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [loading, currentUser]);

  // Function to add a new transaction
  const addTransaction = async (transactionData) => {
    if (!currentUser) return null;
    
    try {
      const newTransaction = await transactionService.addTransaction(currentUser.uid, transactionData);
      
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
        await userProfileService.updateFinancialSummary(currentUser.uid, summary);
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
    if (!currentUser) return null;
    
    try {
      const newGoal = await goalService.addGoal(currentUser.uid, goalData);
      
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
    if (!currentUser) return null;
    
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
    if (!currentUser) return null;
    
    try {
      const updatedProfile = await userProfileService.updateUserProfile(currentUser.uid, profileData);
      
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
  const getInsights = async (timeFrame = 'month') => {
    try {
      // Since we're using mock data, we'll return a structured object that matches
      // what the Insights component expects
      return {
        spendingByCategory: {
          labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
          datasets: [
            {
              data: [35, 20, 15, 10, 12, 8],
              backgroundColor: [
                '#4F46E5', // Primary
                '#7C3AED', // Purple
                '#EC4899', // Pink
                '#F59E0B', // Amber
                '#10B981', // Emerald
                '#6B7280', // Gray
              ],
              borderWidth: 0,
            },
          ],
        },
        monthlySpending: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Spending',
              data: [1200, 1350, 1100, 1500, 1300, 1250],
              backgroundColor: '#4F46E5',
            },
            {
              label: 'Income',
              data: [2000, 2000, 2100, 2000, 2200, 2000],
              backgroundColor: '#10B981',
            },
          ],
        },
        savingsProgress: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Savings',
              data: [500, 800, 1200, 1500, 1800, 2100],
              borderColor: '#4F46E5',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        financialHealth: 85, // Percentage
        recommendations: [
          'Consider increasing your emergency fund to cover 6 months of expenses',
          'Your food spending is 15% higher than last month',
          'You could save $120/month by refinancing your loans',
          'You are on track to reach your vacation savings goal',
        ],
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return null;
    }
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
      if (!currentUser) return;
      const userTransactions = await transactionService.getTransactions(currentUser.uid);
      setTransactions(userTransactions);
    },
    refreshGoals: async () => {
      if (!currentUser) return;
      const userGoals = await goalService.getGoals(currentUser.uid);
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
