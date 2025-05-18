import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const Budget = () => {
  const { userProfile, transactions } = useFinance();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock budget data - in a real app, this would come from Firebase
  useEffect(() => {
    // Simulate loading budgets from a service
    const mockBudgets = [
      { id: 'b1', category: 'Housing', amount: 1500, period: 'monthly', spent: 1200 },
      { id: 'b2', category: 'Food', amount: 600, period: 'monthly', spent: 458.12 },
      { id: 'b3', category: 'Transportation', amount: 200, period: 'monthly', spent: 45 },
      { id: 'b4', category: 'Entertainment', amount: 150, period: 'monthly', spent: 45 },
      { id: 'b5', category: 'Utilities', amount: 300, period: 'monthly', spent: 271.46 },
    ];
    
    setBudgets(mockBudgets);
  }, []);

  // Calculate spending for each budget category
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const updatedBudgets = budgets.map(budget => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return { ...budget, spent };
      });
      
      setBudgets(updatedBudgets);
    }
  }, [transactions]);

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) return;
    
    const budget = {
      id: `b${Date.now()}`,
      category: newBudget.category,
      amount: Number(newBudget.amount),
      period: newBudget.period,
      spent: 0
    };
    
    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', amount: '', period: 'monthly' });
    setShowAddForm(false);
  };

  const handleUpdateBudget = () => {
    if (!editingBudget) return;
    
    const updatedBudgets = budgets.map(budget => 
      budget.id === editingBudget.id ? editingBudget : budget
    );
    
    setBudgets(updatedBudgets);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Common expense categories
  const categories = [
    'Housing', 'Food', 'Transportation', 'Entertainment', 
    'Utilities', 'Healthcare', 'Education', 'Shopping',
    'Personal Care', 'Debt Payments', 'Savings', 'Investments', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            Budget Planning
          </h1>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center"
            disabled={showAddForm}
          >
            <FiPlus className="mr-2" /> New Budget
          </button>
        </div>
        
        {/* Budget Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Budget Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Total Budgeted</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                ${budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Total Spent</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                ${budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Remaining</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                ${(budgets.reduce((sum, budget) => sum + budget.amount, 0) - budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Add Budget Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-secondary-800">Create New Budget</h2>
              <button onClick={() => setShowAddForm(false)} className="text-secondary-500 hover:text-secondary-700">
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                <select 
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Amount</label>
                <input 
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Period</label>
                <select 
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleAddBudget}
                className="btn btn-primary flex items-center"
                disabled={!newBudget.category || !newBudget.amount}
              >
                <FiSave className="mr-2" /> Save Budget
              </button>
            </div>
          </div>
        )}
        
        {/* Budget List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Your Budgets</h2>
          
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary-500">No budgets created yet. Create your first budget to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Budget</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Spent</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Remaining</th>
                    <th className="text-left py-3 px-4 text-secondary-500 font-medium">Progress</th>
                    <th className="text-right py-3 px-4 text-secondary-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map(budget => (
                    <tr key={budget.id} className="border-b border-secondary-100">
                      {editingBudget && editingBudget.id === budget.id ? (
                        // Edit mode
                        <>
                          <td className="py-3 px-4">
                            <select 
                              value={editingBudget.category}
                              onChange={(e) => setEditingBudget({...editingBudget, category: e.target.value})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="number"
                              value={editingBudget.amount}
                              onChange={(e) => setEditingBudget({...editingBudget, amount: Number(e.target.value)})}
                              className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            />
                          </td>
                          <td className="py-3 px-4">${budget.spent?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                          <td className="py-3 px-4">${(editingBudget.amount - (budget.spent || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-secondary-100 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${(budget.spent || 0) > editingBudget.amount ? 'bg-red-500' : 'bg-primary-500'}`}
                                style={{ width: `${Math.min(((budget.spent || 0) / editingBudget.amount) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={handleUpdateBudget}
                              className="text-primary-600 hover:text-primary-800 mr-2"
                            >
                              <FiSave />
                            </button>
                            <button 
                              onClick={() => setEditingBudget(null)}
                              className="text-secondary-500 hover:text-secondary-700"
                            >
                              <FiX />
                            </button>
                          </td>
                        </>
                      ) : (
                        // View mode
                        <>
                          <td className="py-3 px-4 font-medium">{budget.category}</td>
                          <td className="py-3 px-4">${budget.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4">${budget.spent?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                          <td className="py-3 px-4">${(budget.amount - (budget.spent || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-secondary-100 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${(budget.spent || 0) > budget.amount ? 'bg-red-500' : 'bg-primary-500'}`}
                                style={{ width: `${Math.min(((budget.spent || 0) / budget.amount) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1 text-secondary-500">
                              {Math.round(((budget.spent || 0) / budget.amount) * 100)}% used
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => setEditingBudget(budget)}
                              className="text-primary-600 hover:text-primary-800 mr-2"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => handleDeleteBudget(budget.id)}
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

export default Budget;
