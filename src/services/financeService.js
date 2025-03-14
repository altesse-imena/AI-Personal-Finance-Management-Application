import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

// Collection names
const TRANSACTIONS_COLLECTION = 'transactions';
const GOALS_COLLECTION = 'goals';
const USER_PROFILES_COLLECTION = 'userProfiles';

/**
 * User Profile Service
 */
export const userProfileService = {
  // Initialize a user profile when they first sign up
  async initializeUserProfile(userId, userData) {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const defaultData = {
      userId,
      displayName: userData.displayName || '',
      email: userData.email || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        currency: 'USD',
        theme: 'light',
        notifications: true
      },
      financialSummary: {
        balance: 0,
        income: 0,
        expenses: 0,
        savings: 0
      }
    };
    
    await setDoc(userRef, defaultData);
    return defaultData;
  },
  
  // Get a user profile
  async getUserProfile(userId) {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  },
  
  // Update a user profile
  async updateUserProfile(userId, userData) {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const updateData = {
      ...userData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updateData);
    return updateData;
  },
  
  // Update financial summary
  async updateFinancialSummary(userId, summaryData) {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const updateData = {
      'financialSummary': summaryData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updateData);
    return updateData;
  }
};

/**
 * Transactions Service
 */
export const transactionService = {
  // Add a new transaction
  async addTransaction(userId, transactionData) {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    const newTransaction = {
      userId,
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.description,
      date: transactionData.date || new Date(),
      type: transactionData.type, // 'income' or 'expense'
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(transactionsRef, newTransaction);
    return { id: docRef.id, ...newTransaction };
  },
  
  // Get all transactions for a user
  async getTransactions(userId, filters = {}) {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
      let q = query(transactionsRef, where('userId', '==', userId));
      
      // Apply filters if provided
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      // Note: We're avoiding complex queries that require composite indexes
      // If date filtering is needed, we'll filter in memory instead
      
      // Apply sorting - this is what requires the composite index
      // We'll handle sorting in memory for now and create the index later
      // q = query(q, orderBy('date', 'desc'));
      
      // Apply limit if provided
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      let transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Apply date filtering in memory if needed
      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        transactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      }
      
      // Sort by date in memory
      transactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // descending order (newest first)
      });
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // If there's a specific index error, log a helpful message
      if (error.message && error.message.includes('requires an index')) {
        console.log('Firestore index required. Please visit the URL in the error message to create it.');
        console.log('For now, we\'re using a client-side workaround.');
      }
      throw error;
    }
  },
  
  // Get a single transaction
  async getTransaction(transactionId) {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    const transactionSnap = await getDoc(transactionRef);
    
    if (transactionSnap.exists()) {
      return { id: transactionSnap.id, ...transactionSnap.data() };
    } else {
      return null;
    }
  },
  
  // Update a transaction
  async updateTransaction(transactionId, transactionData) {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    const updateData = {
      ...transactionData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(transactionRef, updateData);
    return { id: transactionId, ...updateData };
  },
  
  // Delete a transaction
  async deleteTransaction(transactionId) {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    await deleteDoc(transactionRef);
    return { id: transactionId, deleted: true };
  }
};

/**
 * Goals Service
 */
export const goalService = {
  // Add a new financial goal
  async addGoal(userId, goalData) {
    const goalsRef = collection(db, GOALS_COLLECTION);
    const newGoal = {
      userId,
      name: goalData.name,
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.currentAmount || 0,
      category: goalData.category,
      deadline: goalData.deadline,
      description: goalData.description || '',
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(goalsRef, newGoal);
    return { id: docRef.id, ...newGoal };
  },
  
  // Get all goals for a user
  async getGoals(userId, includeCompleted = true) {
    try {
      const goalsRef = collection(db, GOALS_COLLECTION);
      let q = query(goalsRef, where('userId', '==', userId));
      
      if (!includeCompleted) {
        q = query(q, where('isCompleted', '==', false));
      }
      
      // Remove the orderBy to avoid requiring a composite index
      // q = query(q, orderBy('deadline', 'asc'));
      
      const querySnapshot = await getDocs(q);
      let goals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by deadline in memory instead
      goals.sort((a, b) => {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA - dateB; // ascending order (earliest deadline first)
      });
      
      return goals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      // If there's a specific index error, log a helpful message
      if (error.message && error.message.includes('requires an index')) {
        console.log('Firestore index required. Please visit the URL in the error message to create it.');
        console.log('For now, we\'re using a client-side workaround.');
      }
      throw error;
    }
  },
  
  // Get a single goal
  async getGoal(goalId) {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    const goalSnap = await getDoc(goalRef);
    
    if (goalSnap.exists()) {
      return { id: goalSnap.id, ...goalSnap.data() };
    } else {
      return null;
    }
  },
  
  // Update a goal
  async updateGoal(goalId, goalData) {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    const updateData = {
      ...goalData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(goalRef, updateData);
    return { id: goalId, ...updateData };
  },
  
  // Delete a goal
  async deleteGoal(goalId) {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    await deleteDoc(goalRef);
    return { id: goalId, deleted: true };
  },
  
  // Update goal progress
  async updateGoalProgress(goalId, amount) {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    const goalSnap = await getDoc(goalRef);
    
    if (!goalSnap.exists()) {
      throw new Error('Goal not found');
    }
    
    const goalData = goalSnap.data();
    const newAmount = goalData.currentAmount + amount;
    const isCompleted = newAmount >= goalData.targetAmount;
    
    const updateData = {
      currentAmount: newAmount,
      isCompleted,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(goalRef, updateData);
    return { id: goalId, ...goalData, ...updateData };
  }
};

// Export all services
export default {
  userProfileService,
  transactionService,
  goalService
};
