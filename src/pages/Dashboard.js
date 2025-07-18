import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowUp, FiArrowDown, FiTrendingUp, FiTarget, FiDollarSign, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { useFinance } from '../contexts/FinanceContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const Dashboard = () => {
  // Get data from FinanceContext
  const { 
    userProfile, 
    transactions, 
    goals, 
    isLoading, 
    error, 
    refreshTransactions, 
    refreshGoals,
    getInsights,
    testFirebaseConnection 
  } = useFinance();
  
  // Add console logs for debugging
  console.log('Dashboard render:', { 
    userProfile, 
    transactionsCount: transactions?.length, 
    goalsCount: goals?.length,
    isLoading, 
    error 
  });

  // Local state for UI
  const [timeframe, setTimeframe] = useState('6months');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(null);

  // Extract financial summary data
  const balance = userProfile?.financialSummary?.balance || 0;
  const income = userProfile?.financialSummary?.income || 0;
  const expenses = userProfile?.financialSummary?.expenses || 0;
  const savings = userProfile?.financialSummary?.savings || 0;

  // Format transactions for display
  const recentTransactions = (transactions || []).slice(0, 5).map(transaction => ({
    ...transaction,
    amount: transaction.type === 'expense' ? -transaction.amount : transaction.amount
  }));

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshTransactions(), refreshGoals()]);
    setIsRefreshing(false);
  };

  // Test Firebase connection
  const handleTestFirebaseConnection = async () => {
    try {
      setFirebaseStatus('testing');
      const result = await testFirebaseConnection();
      setFirebaseStatus(result ? 'connected' : 'error');
      setTimeout(() => setFirebaseStatus(null), 3000); // Clear status after 3 seconds
    } catch (error) {
      console.error('Error testing Firebase connection:', error);
      setFirebaseStatus('error');
      setTimeout(() => setFirebaseStatus(null), 3000);
    }
  };

  // Get insights for charts
  const insights = getInsights() || {
    spendingByCategory: {},
    incomeByCategory: {},
    monthlySpending: {}
  };
  
  // Ensure all expected properties exist
  if (!insights.spendingByCategory) insights.spendingByCategory = {};
  if (!insights.incomeByCategory) insights.incomeByCategory = {};
  if (!insights.monthlySpending) insights.monthlySpending = {};

  // Prepare chart data from actual data
  const prepareExpensesByCategoryData = () => {
    // Ensure spendingByCategory is an object before calling Object.keys
    const spendingByCategory = insights.spendingByCategory || {};
    const categories = Object.keys(spendingByCategory);
    const data = categories.map(category => spendingByCategory[category] || 0);
    
    // Enhanced color palette with modern colors
    const backgroundColors = [
      'rgba(79, 70, 229, 0.8)',  // Primary indigo
      'rgba(16, 185, 129, 0.8)', // Emerald
      'rgba(245, 158, 11, 0.8)', // Amber
      'rgba(236, 72, 153, 0.8)', // Pink
      'rgba(6, 182, 212, 0.8)',  // Cyan
      'rgba(124, 58, 237, 0.8)', // Purple
      'rgba(239, 68, 68, 0.8)',  // Red
      'rgba(34, 197, 94, 0.8)',  // Green
    ];
    
    const borderColors = [
      'rgba(79, 70, 229, 1)',  // Primary indigo
      'rgba(16, 185, 129, 1)', // Emerald
      'rgba(245, 158, 11, 1)', // Amber
      'rgba(236, 72, 153, 1)', // Pink
      'rgba(6, 182, 212, 1)',  // Cyan
      'rgba(124, 58, 237, 1)', // Purple
      'rgba(239, 68, 68, 1)',  // Red
      'rgba(34, 197, 94, 1)',  // Green
    ];
    
    return {
      labels: categories.length > 0 ? categories : ['No Data'],
      datasets: [
        {
          data: data.length > 0 ? data : [1],
          backgroundColor: backgroundColors.slice(0, Math.max(categories.length, 1)),
          borderColor: borderColors.slice(0, Math.max(categories.length, 1)),
          borderWidth: 2,
          borderRadius: 4,
          hoverOffset: 8,
        },
      ],
    };
  };

  // Prepare monthly balance data
  const prepareMonthlyBalanceData = () => {
    // This would ideally come from transaction history
    // For now, we'll use a simplified approach
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    // Ensure balance is a number
    const safeBalance = typeof balance === 'number' ? balance : 0;
    const balanceData = [safeBalance * 0.6, safeBalance * 0.7, safeBalance * 0.8, safeBalance * 0.9, safeBalance * 0.95, safeBalance];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(79, 70, 229, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Prepare income vs expenses data
  const prepareIncomeVsExpensesData = () => {
    // This would ideally come from transaction history
    // For now, we'll use a simplified approach
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    // Ensure income and expenses are numbers
    const safeIncome = typeof income === 'number' ? income : 0;
    const safeExpenses = typeof expenses === 'number' ? expenses : 0;
    const incomeData = [safeIncome * 0.9, safeIncome * 0.95, safeIncome, safeIncome, safeIncome * 1.05, safeIncome * 1.1];
    const expensesData = [safeExpenses * 0.9, safeExpenses * 0.95, safeExpenses, safeExpenses * 1.05, safeExpenses * 0.95, safeExpenses];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        },
      ],
    };
  };
  
  // Generate chart data
  const expensesByCategoryData = prepareExpensesByCategoryData();
  const monthlyBalanceData = prepareMonthlyBalanceData();
  const incomeVsExpensesData = prepareIncomeVsExpensesData();

  // AI Recommendations based on actual data
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Check savings rate
    if (income > 0) {
      const savingsRate = (savings / income) * 100;
      if (savingsRate >= 30) {
        recommendations.push(`Your current savings rate of ${savingsRate.toFixed(0)}% is excellent. Keep it up!`);
      } else if (savingsRate >= 20) {
        recommendations.push(`Your savings rate of ${savingsRate.toFixed(0)}% is good. Try to increase it to 30%.`);
      } else {
        recommendations.push(`Your savings rate of ${savingsRate.toFixed(0)}% could be improved. Aim for at least 20%.`);
      }
    }
    
    // Check goals progress
    const incompleteGoals = goals.filter(goal => !goal.isCompleted);
    if (incompleteGoals.length > 0) {
      const mostUrgentGoal = incompleteGoals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
      if (mostUrgentGoal) {
        const remaining = mostUrgentGoal.targetAmount - mostUrgentGoal.currentAmount;
        recommendations.push(`Consider allocating $${Math.ceil(remaining / 5)} more towards your ${mostUrgentGoal.name} to reach your goal faster.`);
      }
    }
    
    // Check spending in categories
    const foodExpenses = insights.spendingByCategory['Food'] || 0;
    if (foodExpenses > expenses * 0.3) {
      recommendations.push(`Your food expenses are ${((foodExpenses / expenses) * 100).toFixed(0)}% of your total expenses. Try to reduce this to 25%.`);
    }
    
    // If we don't have enough recommendations, add a generic one
    if (recommendations.length < 3) {
      recommendations.push("Set up automatic transfers to your savings account to make saving easier.");
    }
    
    return recommendations.slice(0, 3); // Return at most 3 recommendations
  };
  
  const recommendations = generateRecommendations();

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-secondary-50 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-200">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading your financial data...</h2>
          <button
            onClick={handleTestFirebaseConnection}
            className="mt-4 text-xs px-3 py-1 rounded bg-secondary-100 hover:bg-secondary-200 transition-colors"
            disabled={firebaseStatus === 'testing'}
          >
            {firebaseStatus === 'testing' ? 'Testing...' : 
             firebaseStatus === 'connected' ? 'Connected ✓' :
             firebaseStatus === 'error' ? 'Error ✗' : 'Test Firebase Connection'}
          </button>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-secondary-50 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-200">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-600 dark:bg-primary-800 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 dark:from-gray-900 to-secondary-100 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">Dashboard</h1>
            <button 
              onClick={handleRefresh} 
              className="ml-4 text-primary-600 dark:text-primary-400 hover:text-primary-800 transition-colors p-2 rounded-full hover:bg-primary-50 dark:hover:bg-gray-700"
              disabled={isRefreshing}
              title="Refresh data"
            >
              <FiRefreshCw className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-secondary-200 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-colors duration-200"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 dark:text-gray-400" />
            </div>
            
            <button
              onClick={handleTestFirebaseConnection}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${firebaseStatus === 'testing' ? 'bg-secondary-200 dark:bg-gray-700 text-secondary-600' : firebaseStatus === 'connected' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : firebaseStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : 'bg-primary-600 dark:bg-primary-800 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'}`}
              disabled={firebaseStatus === 'testing'}
            >
              {firebaseStatus === 'testing' ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Testing...
                </>
              ) : firebaseStatus === 'connected' ? (
                <>Connected ✓</>
              ) : firebaseStatus === 'error' ? (
                <>Connection Error</>
              ) : (
                <>Test Connection</>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center">
            <Link to="/transactions/new" className="btn btn-primary flex items-center">
              <FiPlus className="mr-2" /> Add Transaction
            </Link>
            <Link to="/goals/new" className="btn btn-secondary flex items-center">
              <FiTarget className="mr-2" /> New Goal
            </Link>
          </div>
        </div>
        
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-500 dark:text-gray-400 text-sm">Current Balance</p>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FiDollarSign className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className="text-sm text-secondary-500 dark:text-gray-400">Updated today</p>
          </div>

          {/* Income Card */}
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-500 dark:text-gray-400 text-sm">Monthly Income</p>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiArrowUp className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-success flex items-center">
              <FiArrowUp className="mr-1" /> 5% from last month
            </p>
          </div>

          {/* Expenses Card */}
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-500 dark:text-gray-400 text-sm">Monthly Expenses</p>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiArrowDown className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-sm text-danger flex items-center">
              <FiArrowDown className="mr-1" /> 3% from last month
            </p>
          </div>

          {/* Savings Card */}
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-500 dark:text-gray-400 text-sm">Savings</p>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FiTrendingUp className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-sm text-blue-600 flex items-center">
              <FiArrowUp className="mr-1" /> 8% from last month
            </p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Income vs Expenses Chart */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Income vs Expenses</h3>
              <div className="h-80">
                <Bar 
                  data={incomeVsExpensesData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* Monthly Balance Trend */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Balance Trend</h3>
              <div className="h-80">
                <Line 
                  data={monthlyBalanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">Recent Transactions</h3>
                <Link to="/transactions" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">View All</Link>
              </div>
              
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary-500 dark:text-gray-400">No transactions yet. Add your first transaction to get started.</p>
                  <Link to="/transactions/new" className="mt-4 btn btn-primary inline-flex items-center">
                    <FiPlus className="mr-2" /> Add Transaction
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {transaction.type === 'income' ? (
                            <FiArrowUp className="text-green-600 dark:text-green-400" />
                          ) : (
                            <FiArrowDown className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-secondary-900 dark:text-white">{transaction.description}</p>
                          <p className="text-xs text-secondary-500 dark:text-gray-400">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* AI Recommendations */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                  <FiRefreshCw className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">AI Financial Recommendations</h3>
              </div>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-secondary-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                    <p className="text-secondary-700 dark:text-gray-400">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Expense Breakdown</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={expensesByCategoryData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Financial Goals */}
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-stripe-sm p-6 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">Financial Goals</h3>
                <Link to="/goals" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="p-3 bg-secondary-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-secondary-900 dark:text-white">{goal.name}</p>
                        <p className="text-xs font-semibold text-secondary-700 dark:text-gray-300">
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-gray-600 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-secondary-500 dark:text-gray-400">
                        <p>{progress.toFixed(0)}% complete</p>
                        <p>Target: {new Date(goal.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Link
                  to="/goals/new"
                  className="btn btn-secondary w-full flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Add New Goal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
