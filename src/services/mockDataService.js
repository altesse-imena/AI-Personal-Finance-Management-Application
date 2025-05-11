// Mock data service to simulate Firebase interactions without requiring database access
// This helps bypass Firebase permission issues during development

// Sample user profile data
const mockUserProfile = {
  userId: 'mock-user-id',
  displayName: 'Demo User',
  email: 'demo@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    currency: 'USD',
    theme: 'light',
    notifications: true
  },
  financialSummary: {
    balance: 5280.42,
    income: 8500.00,
    expenses: 3219.58,
    savings: 2000.00
  }
};

// Sample transactions data
const mockTransactions = [
  {
    id: 'trans-1',
    userId: 'mock-user-id',
    type: 'income',
    amount: 4500.00,
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date(2025, 4, 1),
    createdAt: new Date(2025, 4, 1)
  },
  {
    id: 'trans-2',
    userId: 'mock-user-id',
    type: 'income',
    amount: 2000.00,
    category: 'Freelance',
    description: 'Website development project',
    date: new Date(2025, 4, 5),
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: 'trans-3',
    userId: 'mock-user-id',
    type: 'income',
    amount: 2000.00,
    category: 'Investment',
    description: 'Dividend payment',
    date: new Date(2025, 4, 8),
    createdAt: new Date(2025, 4, 8)
  },
  {
    id: 'trans-4',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 1200.00,
    category: 'Housing',
    description: 'Monthly rent',
    date: new Date(2025, 4, 3),
    createdAt: new Date(2025, 4, 3)
  },
  {
    id: 'trans-5',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 85.42,
    category: 'Utilities',
    description: 'Electricity bill',
    date: new Date(2025, 4, 5),
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: 'trans-6',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 65.29,
    category: 'Utilities',
    description: 'Water bill',
    date: new Date(2025, 4, 6),
    createdAt: new Date(2025, 4, 6)
  },
  {
    id: 'trans-7',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 120.75,
    category: 'Utilities',
    description: 'Internet bill',
    date: new Date(2025, 4, 7),
    createdAt: new Date(2025, 4, 7)
  },
  {
    id: 'trans-8',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 458.12,
    category: 'Food',
    description: 'Grocery shopping',
    date: new Date(2025, 4, 4),
    createdAt: new Date(2025, 4, 4)
  },
  {
    id: 'trans-9',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 45.00,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: new Date(2025, 4, 9),
    createdAt: new Date(2025, 4, 9)
  },
  {
    id: 'trans-10',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 1200.00,
    category: 'Education',
    description: 'Online course subscription',
    date: new Date(2025, 4, 2),
    createdAt: new Date(2025, 4, 2)
  },
  {
    id: 'trans-11',
    userId: 'mock-user-id',
    type: 'expense',
    amount: 45.00,
    category: 'Transportation',
    description: 'Uber ride',
    date: new Date(2025, 4, 8),
    createdAt: new Date(2025, 4, 8)
  }
];

// Sample goals data
const mockGoals = [
  {
    id: 'goal-1',
    userId: 'mock-user-id',
    title: 'Emergency Fund',
    targetAmount: 10000.00,
    currentAmount: 5000.00,
    category: 'Savings',
    deadline: new Date(2025, 11, 31),
    createdAt: new Date(2025, 0, 1),
    updatedAt: new Date(2025, 4, 1),
    status: 'in-progress'
  },
  {
    id: 'goal-2',
    userId: 'mock-user-id',
    title: 'New Laptop',
    targetAmount: 2000.00,
    currentAmount: 800.00,
    category: 'Electronics',
    deadline: new Date(2025, 7, 15),
    createdAt: new Date(2025, 2, 10),
    updatedAt: new Date(2025, 4, 5),
    status: 'in-progress'
  },
  {
    id: 'goal-3',
    userId: 'mock-user-id',
    title: 'Vacation Fund',
    targetAmount: 3500.00,
    currentAmount: 1200.00,
    category: 'Travel',
    deadline: new Date(2025, 8, 30),
    createdAt: new Date(2025, 1, 15),
    updatedAt: new Date(2025, 4, 3),
    status: 'in-progress'
  }
];

// Helper function to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock user profile service
export const mockUserProfileService = {
  getUserProfile: async (userId) => {
    console.log('Mock: Getting user profile for', userId);
    return { ...mockUserProfile, userId };
  },
  
  initializeUserProfile: async (userId, userData) => {
    console.log('Mock: Initializing user profile for', userId, userData);
    return { 
      ...mockUserProfile, 
      userId,
      displayName: userData.displayName || mockUserProfile.displayName,
      email: userData.email || mockUserProfile.email
    };
  },
  
  updateUserProfile: async (userId, profileData) => {
    console.log('Mock: Updating user profile for', userId, profileData);
    return { ...mockUserProfile, ...profileData, userId };
  },
  
  updateFinancialSummary: async (userId, summary) => {
    console.log('Mock: Updating financial summary for', userId, summary);
    return { ...mockUserProfile.financialSummary, ...summary };
  }
};

// Mock transaction service
export const mockTransactionService = {
  getTransactions: async (userId, options = {}) => {
    console.log('Mock: Getting transactions for', userId, options);
    return mockTransactions;
  },
  
  addTransaction: async (userId, transactionData) => {
    console.log('Mock: Adding transaction for', userId, transactionData);
    const newTransaction = {
      id: generateId(),
      userId,
      ...transactionData,
      createdAt: new Date(),
      date: transactionData.date || new Date()
    };
    return newTransaction;
  },
  
  updateTransaction: async (transactionId, transactionData) => {
    console.log('Mock: Updating transaction', transactionId, transactionData);
    return { ...transactionData, id: transactionId, updatedAt: new Date() };
  },
  
  deleteTransaction: async (transactionId) => {
    console.log('Mock: Deleting transaction', transactionId);
    return true;
  }
};

// Mock goal service
export const mockGoalService = {
  getGoals: async (userId) => {
    console.log('Mock: Getting goals for', userId);
    return mockGoals;
  },
  
  addGoal: async (userId, goalData) => {
    console.log('Mock: Adding goal for', userId, goalData);
    const newGoal = {
      id: generateId(),
      userId,
      ...goalData,
      currentAmount: goalData.currentAmount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'in-progress'
    };
    return newGoal;
  },
  
  updateGoal: async (goalId, goalData) => {
    console.log('Mock: Updating goal', goalId, goalData);
    return { ...goalData, id: goalId, updatedAt: new Date() };
  },
  
  updateGoalProgress: async (goalId, amount) => {
    console.log('Mock: Updating goal progress', goalId, amount);
    const goal = mockGoals.find(g => g.id === goalId) || mockGoals[0];
    const updatedGoal = { 
      ...goal, 
      currentAmount: goal.currentAmount + Number(amount),
      updatedAt: new Date()
    };
    
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      updatedGoal.status = 'completed';
    }
    
    return updatedGoal;
  },
  
  deleteGoal: async (goalId) => {
    console.log('Mock: Deleting goal', goalId);
    return true;
  }
};
