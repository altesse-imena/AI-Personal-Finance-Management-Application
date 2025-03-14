import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiDollarSign, FiTarget, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const Goals = () => {
  const { goals, addGoal, updateGoalProgress, isLoading, error } = useFinance();
  const [localGoals, setLocalGoals] = useState([
    { 
      id: 1, 
      name: 'Emergency Fund', 
      description: 'Save for unexpected expenses',
      current: 2500, 
      target: 10000, 
      deadline: '2025-09-01',
      category: 'Savings',
      priority: 'High'
    },
    { 
      id: 2, 
      name: 'Vacation', 
      description: 'Trip to Hawaii',
      current: 1200, 
      target: 3000, 
      deadline: '2025-06-15',
      category: 'Travel',
      priority: 'Medium'
    },
    { 
      id: 3, 
      name: 'New Laptop', 
      description: 'Replace old computer',
      current: 400, 
      target: 1500, 
      deadline: '2025-05-01',
      category: 'Electronics',
      priority: 'Low'
    },
    { 
      id: 4, 
      name: 'Down Payment', 
      description: 'For first home purchase',
      current: 15000, 
      target: 60000, 
      deadline: '2027-01-01',
      category: 'Housing',
      priority: 'High'
    },
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    current: 0,
    target: 0,
    deadline: '',
    category: 'Savings',
    priority: 'Medium'
  });

  // Generate recommendations based on goals data
  const generateRecommendations = () => {
    if (!goals || goals.length === 0) return [];
    
    const recommendations = [];
    
    // Check for goals with slow progress
    const today = new Date();
    goals.forEach(goal => {
      if (goal.isCompleted) return;
      
      const deadline = new Date(goal.deadline);
      const totalDays = (deadline - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
      const daysElapsed = (today - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
      const progressPercentage = goal.currentAmount / goal.targetAmount;
      const timePercentage = daysElapsed / totalDays;
      
      // If progress percentage is significantly less than time percentage
      if (progressPercentage < timePercentage * 0.7 && timePercentage > 0.25) {
        const monthlyTarget = (goal.targetAmount - goal.currentAmount) / ((deadline - today) / (1000 * 60 * 60 * 24 * 30));
        recommendations.push(
          `Your ${goal.name} goal is falling behind. Consider increasing monthly contributions to $${monthlyTarget.toFixed(2)} to reach your target by ${new Date(goal.deadline).toLocaleDateString()}.`
        );
      }
    });
    
    // Add general recommendations
    if (goals.length < 3) {
      recommendations.push("Consider setting up more financial goals to better organize your finances.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your goals are on track. Keep up the good work!");
    }
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: name === 'current' || name === 'target' ? parseFloat(value) || 0 : value
    });
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    
    try {
      // Convert form data to match the expected format in the service
      const goalData = {
        name: newGoal.name,
        description: newGoal.description,
        targetAmount: parseFloat(newGoal.target),
        currentAmount: parseFloat(newGoal.current),
        deadline: newGoal.deadline,
        category: newGoal.category,
        priority: newGoal.priority
      };
      
      // Add goal using the context function
      await addGoal(goalData);
      
      // Reset form
      setNewGoal({
        name: '',
        description: '',
        current: 0,
        target: 0,
        deadline: '',
        category: 'Savings',
        priority: 'Medium'
      });
      setShowNewGoalForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal. Please try again.');
    }
  };

  // This would be implemented in the FinanceContext
  const handleDeleteGoal = (id) => {
    // We would call a deleteGoal function from the context here
    // For now, we'll just show an alert
    alert('This feature is coming soon!');
  };

  const calculateTimeRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month left';
    if (diffMonths < 12) return `${diffMonths} months left`;
    
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears === 1) return '1 year left';
    return `${diffYears} years left`;
  };

  const getPriorityBadgeColor = (priority) => {
    // Handle undefined or null priority values
    if (!priority) {
      return 'bg-secondary-100 text-secondary-800';
    }
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  // Effect to update local state when goals change
  useEffect(() => {
    if (goals && Array.isArray(goals)) {
      setLocalGoals(goals);
    }
  }, [goals]);

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Financial Goals</h1>
          <button 
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            className="btn btn-primary flex items-center mt-4 md:mt-0"
          >
            <FiPlus className="mr-2" /> {showNewGoalForm ? 'Cancel' : 'Add New Goal'}
          </button>
        </div>

        {/* New Goal Form */}
        {showNewGoalForm && (
          <div className="card bg-white rounded-xl shadow-stripe-sm mb-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Create New Goal</h2>
            <form onSubmit={handleAddGoal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label mb-1">Goal Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="label mb-1">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={newGoal.description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Brief description of your goal"
                  />
                </div>
                <div>
                  <label htmlFor="current" className="label mb-1">Current Amount ($)</label>
                  <input
                    type="number"
                    id="current"
                    name="current"
                    value={newGoal.current}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="target" className="label mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    id="target"
                    name="target"
                    value={newGoal.target}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="deadline" className="label mb-1">Target Date</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={newGoal.deadline}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="label mb-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newGoal.category}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Investment">Investment</option>
                    <option value="Debt">Debt Repayment</option>
                    <option value="Housing">Housing</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="label mb-1">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newGoal.priority}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="card bg-white rounded-xl shadow-stripe-sm mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <FiTarget className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-secondary-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoading && localGoals && localGoals.length > 0 ? localGoals.map((goal) => {
            // Safely calculate progress with fallback values
            const currentAmount = goal.currentAmount || goal.current || 0;
            const targetAmount = goal.targetAmount || goal.target || 1; // Prevent division by zero
            const progress = (currentAmount / targetAmount) * 100;
            return (
              <div key={goal.id} className="card bg-white rounded-xl shadow-stripe-sm stagger-item">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-secondary-900">{goal.name}</h3>
                  <span className={`badge ${getPriorityBadgeColor(goal.priority)}`}>
                    {goal.priority || 'Medium'}
                  </span>
                </div>
                <p className="text-secondary-600 mb-4">{goal.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-secondary-600">Progress</span>
                    <span className="text-sm font-medium text-secondary-900">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-secondary-500 mb-1">
                      <FiDollarSign className="mr-1" /> Current
                    </div>
                    <div className="font-semibold text-secondary-900">
                      ${(goal.currentAmount || goal.current || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-secondary-500 mb-1">
                      <FiTarget className="mr-1" /> Target
                    </div>
                    <div className="font-semibold text-secondary-900">
                      ${(goal.targetAmount || goal.target || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-secondary-600">
                    <FiCalendar className="mr-1" /> Due {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-secondary-600">
                    <FiClock className="mr-1" /> {calculateTimeRemaining(goal.deadline)}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    className="btn btn-outline-primary flex items-center py-1.5"
                    onClick={() => {
                      const amount = prompt('Enter amount to add:', '0');
                      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                        updateGoalProgress(goal.id, parseFloat(amount));
                      }
                    }}
                  >
                    <FiDollarSign className="mr-1" /> Add Funds
                  </button>
                  <button 
                    className="btn btn-danger flex items-center py-1.5"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-3 text-center py-12">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">No goals found</h3>
              <p className="text-secondary-500 mb-4">Start by creating your first financial goal</p>
              <button 
                onClick={() => setShowNewGoalForm(true)}
                className="btn btn-primary inline-flex items-center"
              >
                <FiPlus className="mr-2" /> Create Goal
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="card bg-white rounded-xl shadow-stripe-sm text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No goals yet</h3>
            <p className="text-secondary-600 mb-6">
              Start setting financial goals to track your progress and get personalized recommendations.
            </p>
            <button 
              onClick={() => setShowNewGoalForm(true)}
              className="btn btn-primary mx-auto"
            >
              <FiPlus className="mr-2" /> Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
