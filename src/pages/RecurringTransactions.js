import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiCalendar, FiRepeat, FiDollarSign, FiTag } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const RecurringTransactions = () => {
  const { userProfile } = useFinance();
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    nextDate: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock recurring transaction data - in a real app, this would come from Firebase
  useEffect(() => {
    // Simulate loading recurring transactions from a service
    const mockRecurringTransactions = [
      { 
        id: 'rt1', 
        name: 'Salary', 
        amount: 4500.00, 
        type: 'income', 
        category: 'Salary',
        frequency: 'monthly',
        nextDate: new Date(2025, 5, 30),
        description: 'Monthly salary payment',
        createdAt: new Date(2025, 0, 1)
      },
      { 
        id: 'rt2', 
        name: 'Rent', 
        amount: 1200.00, 
        type: 'expense', 
        category: 'Housing',
        frequency: 'monthly',
        nextDate: new Date(2025, 5, 1),
        description: 'Monthly apartment rent',
        createdAt: new Date(2025, 0, 1)
      },
      { 
        id: 'rt3', 
        name: 'Internet', 
        amount: 65.99, 
        type: 'expense', 
        category: 'Utilities',
        frequency: 'monthly',
        nextDate: new Date(2025, 5, 15),
        description: 'Home internet service',
        createdAt: new Date(2025, 0, 15)
      },
      { 
        id: 'rt4', 
        name: 'Phone Bill', 
        amount: 45.00, 
        type: 'expense', 
        category: 'Utilities',
        frequency: 'monthly',
        nextDate: new Date(2025, 5, 22),
        description: 'Mobile phone service',
        createdAt: new Date(2025, 0, 22)
      },
      { 
        id: 'rt5', 
        name: 'Gym Membership', 
        amount: 50.00, 
        type: 'expense', 
        category: 'Health',
        frequency: 'monthly',
        nextDate: new Date(2025, 5, 5),
        description: 'Monthly gym membership fee',
        createdAt: new Date(2025, 0, 5)
      }
    ];
    
    setRecurringTransactions(mockRecurringTransactions);
  }, []);

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.nextDate) return;
    
    const transaction = {
      id: `rt${Date.now()}`,
      name: newTransaction.name,
      amount: Number(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      frequency: newTransaction.frequency,
      nextDate: new Date(newTransaction.nextDate),
      description: newTransaction.description,
      createdAt: new Date()
    };
    
    setRecurringTransactions([...recurringTransactions, transaction]);
    setNewTransaction({
      name: '',
      amount: '',
      type: 'expense',
      category: '',
      frequency: 'monthly',
      nextDate: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction) return;
    
    const updatedTransactions = recurringTransactions.map(transaction => 
      transaction.id === editingTransaction.id ? {
        ...editingTransaction,
        nextDate: new Date(editingTransaction.nextDate),
        amount: Number(editingTransaction.amount)
      } : transaction
    );
    
    setRecurringTransactions(updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    setRecurringTransactions(recurringTransactions.filter(transaction => transaction.id !== id));
  };

  // Calculate monthly totals
  const calculateTotals = () => {
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    recurringTransactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        if (transaction.frequency === 'monthly') {
          monthlyIncome += amount;
        } else if (transaction.frequency === 'weekly') {
          monthlyIncome += amount * 4.33; // Average weeks in a month
        } else if (transaction.frequency === 'bi-weekly') {
          monthlyIncome += amount * 2.17; // Average bi-weekly occurrences in a month
        } else if (transaction.frequency === 'yearly') {
          monthlyIncome += amount / 12;
        } else if (transaction.frequency === 'quarterly') {
          monthlyIncome += amount / 3;
        }
      } else {
        if (transaction.frequency === 'monthly') {
          monthlyExpenses += amount;
        } else if (transaction.frequency === 'weekly') {
          monthlyExpenses += amount * 4.33;
        } else if (transaction.frequency === 'bi-weekly') {
          monthlyExpenses += amount * 2.17;
        } else if (transaction.frequency === 'yearly') {
          monthlyExpenses += amount / 12;
        } else if (transaction.frequency === 'quarterly') {
          monthlyExpenses += amount / 3;
        }
      }
    });
    
    return { 
      monthlyIncome: monthlyIncome.toFixed(2), 
      monthlyExpenses: monthlyExpenses.toFixed(2),
      monthlyNet: (monthlyIncome - monthlyExpenses).toFixed(2)
    };
  };

  const { monthlyIncome, monthlyExpenses, monthlyNet } = calculateTotals();

  // Filter transactions
  const filteredTransactions = filter === 'all' 
    ? recurringTransactions 
    : filter === 'income'
      ? recurringTransactions.filter(transaction => transaction.type === 'income')
      : recurringTransactions.filter(transaction => transaction.type === 'expense');

  // Sort transactions by next date
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    a.nextDate - b.nextDate
  );

  // Common expense categories
  const expenseCategories = [
    'Housing', 'Food', 'Transportation', 'Entertainment', 
    'Utilities', 'Healthcare', 'Education', 'Shopping',
    'Personal Care', 'Debt Payments', 'Savings', 'Investments', 'Other'
  ];

  // Common income categories
  const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investments', 
    'Rental Income', 'Gifts', 'Other'
  ];

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get next occurrence based on frequency
  const getNextOccurrence = (date, frequency) => {
    const nextDate = new Date(date);
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'bi-weekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        break;
    }
    
    return nextDate;
  };

  // Calculate days until next occurrence
  const getDaysUntil = (date) => {
    const today = new Date();
    const nextDate = new Date(date);
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            Recurring Transactions
          </h1>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center"
            disabled={showAddForm}
          >
            <FiPlus className="mr-2" /> Add Recurring Transaction
          </button>
        </div>
        
        {/* Recurring Transactions Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Monthly Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Monthly Income</p>
              <h3 className="text-2xl font-bold text-green-600">
                ${monthlyIncome}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Monthly Expenses</p>
              <h3 className="text-2xl font-bold text-red-600">
                ${monthlyExpenses}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Monthly Net</p>
              <h3 className={`text-2xl font-bold ${Number(monthlyNet) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyNet}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-secondary-800">Add Recurring Transaction</h2>
              <button onClick={() => setShowAddForm(false)} className="text-secondary-500 hover:text-secondary-700">
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <input 
                  type="text"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                  placeholder="e.g. Rent"
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-secondary-500">$</span>
                  </div>
                  <input 
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-8 rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                <select 
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                <select 
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="">Select a category</option>
                  {newTransaction.type === 'expense' ? (
                    expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  ) : (
                    incomeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Frequency</label>
                <select 
                  value={newTransaction.frequency}
                  onChange={(e) => setNewTransaction({...newTransaction, frequency: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Next Date</label>
                <input 
                  type="date"
                  value={newTransaction.nextDate}
                  onChange={(e) => setNewTransaction({...newTransaction, nextDate: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description (Optional)</label>
                <input 
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="e.g. Monthly apartment rent"
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleAddTransaction}
                className="btn btn-primary flex items-center"
                disabled={!newTransaction.name || !newTransaction.amount || !newTransaction.nextDate}
              >
                <FiSave className="mr-2" /> Save Transaction
              </button>
            </div>
          </div>
        )}
        
        {/* Filter Controls */}
        <div className="flex mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`mr-2 px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('income')}
            className={`mr-2 px-4 py-2 rounded-lg ${filter === 'income' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Income
          </button>
          <button 
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg ${filter === 'expense' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Expenses
          </button>
        </div>
        
        {/* Recurring Transactions List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Your Recurring Transactions</h2>
          
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary-500">No recurring transactions found. Add your first recurring transaction to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Frequency</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Next Date</th>
                    <th className="text-right py-3 px-4 text-secondary-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-secondary-100">
                      {editingTransaction && editingTransaction.id === transaction.id ? (
                        // Edit mode
                        <>
                          <td className="py-3 px-4">
                            <input 
                              type="text"
                              value={editingTransaction.name}
                              onChange={(e) => setEditingTransaction({...editingTransaction, name: e.target.value})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-secondary-500">$</span>
                              </div>
                              <input 
                                type="number"
                                value={editingTransaction.amount}
                                onChange={(e) => setEditingTransaction({...editingTransaction, amount: e.target.value})}
                                className="w-full pl-8 rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <select 
                              value={editingTransaction.category}
                              onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            >
                              {editingTransaction.type === 'expense' ? (
                                expenseCategories.map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))
                              ) : (
                                incomeCategories.map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))
                              )}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select 
                              value={editingTransaction.frequency}
                              onChange={(e) => setEditingTransaction({...editingTransaction, frequency: e.target.value})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="date"
                              value={editingTransaction.nextDate instanceof Date 
                                ? editingTransaction.nextDate.toISOString().split('T')[0] 
                                : new Date(editingTransaction.nextDate).toISOString().split('T')[0]}
                              onChange={(e) => setEditingTransaction({...editingTransaction, nextDate: e.target.value})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={handleUpdateTransaction}
                              className="text-primary-600 hover:text-primary-800 mr-2"
                            >
                              <FiSave />
                            </button>
                            <button 
                              onClick={() => setEditingTransaction(null)}
                              className="text-secondary-500 hover:text-secondary-700"
                            >
                              <FiX />
                            </button>
                          </td>
                        </>
                      ) : (
                        // View mode
                        <>
                          <td className="py-3 px-4">
                            <div className="font-medium text-secondary-900">{transaction.name}</div>
                            <div className="text-xs text-secondary-500">{transaction.description}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FiRepeat className="text-secondary-400 mr-2" />
                              <span className="capitalize">{transaction.frequency}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FiCalendar className="text-secondary-400 mr-2" />
                              <span>{formatDate(transaction.nextDate)}</span>
                            </div>
                            <div className="text-xs mt-1">
                              {getDaysUntil(transaction.nextDate) <= 0 ? (
                                <span className="text-red-500 font-medium">Due today</span>
                              ) : getDaysUntil(transaction.nextDate) <= 3 ? (
                                <span className="text-orange-500 font-medium">Due in {getDaysUntil(transaction.nextDate)} days</span>
                              ) : (
                                <span className="text-secondary-500">Due in {getDaysUntil(transaction.nextDate)} days</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => setEditingTransaction(transaction)}
                              className="text-primary-600 hover:text-primary-800 mr-2"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringTransactions;
