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
  const recentTransactions = transactions.slice(0, 5).map(transaction => ({
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

  // Prepare chart data from actual data
  const prepareExpensesByCategoryData = () => {
    const categories = Object.keys(insights.spendingByCategory);
    const data = categories.map(category => insights.spendingByCategory[category]);
    
    // Default colors
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
    ];
    
    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];
    
    return {
      labels: categories.length > 0 ? categories : ['No Data'],
      datasets: [
        {
          data: data.length > 0 ? data : [1],
          backgroundColor: backgroundColors.slice(0, Math.max(categories.length, 1)),
          borderColor: borderColors.slice(0, Math.max(categories.length, 1)),
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare monthly balance data
  const prepareMonthlyBalanceData = () => {
    // This would ideally come from transaction history
    // For now, we'll use a simplified approach
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const balanceData = [balance * 0.6, balance * 0.7, balance * 0.8, balance * 0.9, balance * 0.95, balance];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: 'rgba(14, 165, 233, 1)',
          backgroundColor: 'rgba(14, 165, 233, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };

  // Prepare income vs expenses data
  const prepareIncomeVsExpensesData = () => {
    // This would ideally come from transaction history
    // For now, we'll use a simplified approach
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = [income * 0.9, income * 0.95, income, income, income * 1.05, income * 1.1];
    const expensesData = [expenses * 0.9, expenses * 0.95, expenses, expenses * 1.05, expenses * 0.95, expenses];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
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
      <div className="bg-secondary-50 min-h-screen py-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your financial data...</h2>
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
      <div className="bg-secondary-50 min-h-screen py-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
            <button 
              onClick={handleRefresh} 
              className="ml-4 p-2 rounded-full hover:bg-secondary-100 transition-colors"
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`text-secondary-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleTestFirebaseConnection}
              className="ml-2 text-xs px-3 py-1 rounded bg-secondary-100 hover:bg-secondary-200 transition-colors"
              disabled={firebaseStatus === 'testing'}
            >
              {firebaseStatus === 'testing' ? 'Testing...' : 
               firebaseStatus === 'connected' ? 'Connected ✓' :
               firebaseStatus === 'error' ? 'Error ✗' : 'Test Firebase'}
            </button>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/transactions/new" className="btn btn-primary flex items-center">
              <FiPlus className="mr-2" /> Add Transaction
            </Link>
            <Link to="/goals/new" className="btn btn-secondary flex items-center">
              <FiTarget className="mr-2" /> New Goal
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Balance Card */}
              <div className="card bg-white rounded-xl shadow-stripe-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary-500 text-sm">Current Balance</p>
                    <h2 className="text-3xl font-bold text-secondary-900">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiDollarSign className="text-primary-600" />
                  </div>
                </div>
                <p className="text-sm text-secondary-500">Updated today</p>
              </div>

              {/* Income Card */}
              <div className="card bg-white rounded-xl shadow-stripe-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary-500 text-sm">Monthly Income</p>
                    <h2 className="text-3xl font-bold text-secondary-900">${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiArrowUp className="text-success" />
                  </div>
                </div>
                <p className="text-sm text-success flex items-center">
                  <FiArrowUp className="mr-1" /> 5% from last month
                </p>
              </div>

              {/* Expenses Card */}
              <div className="card bg-white rounded-xl shadow-stripe-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary-500 text-sm">Monthly Expenses</p>
                    <h2 className="text-3xl font-bold text-secondary-900">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FiArrowDown className="text-danger" />
                  </div>
                </div>
                <p className="text-sm text-danger flex items-center">
                  <FiArrowDown className="mr-1" /> 3% from last month
                </p>
              </div>

              {/* Savings Card */}
              <div className="card bg-white rounded-xl shadow-stripe-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary-500 text-sm">Monthly Savings</p>
                    <h2 className="text-3xl font-bold text-secondary-900">${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiTrendingUp className="text-primary-600" />
                  </div>
                </div>
                <p className="text-sm text-success flex items-center">
                  <FiArrowUp className="mr-1" /> 39% of income
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Monthly Balance Chart */}
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-secondary-900">Balance Trend</h3>
                    <select className="input py-1 px-2 w-auto text-sm">
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                      <option>This year</option>
                    </select>
                  </div>
                  <div className="h-64">
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
                            grid: {
                              drawBorder: false,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Income vs Expenses Chart */}
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-secondary-900">Income vs Expenses</h3>
                    <select className="input py-1 px-2 w-auto text-sm">
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                      <option>This year</option>
                    </select>
                  </div>
                  <div className="h-64">
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
                            grid: {
                              drawBorder: false,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-secondary-900">Recent Transactions</h3>
                    <Link to="/transactions" className="text-primary-600 hover:text-primary-700 text-sm">
                      View all
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-secondary-100">
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-secondary-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-900">
                              {transaction.description}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">
                              {transaction.category}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                              transaction.amount > 0 ? 'text-success' : 'text-danger'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}
                              ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* AI Recommendations */}
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <FiTrendingUp className="text-primary-600" />
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

                {/* Expense Breakdown */}
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-6">Expense Breakdown</h3>
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
                <div className="card bg-white rounded-xl shadow-stripe-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-secondary-900">Financial Goals</h3>
                    <Link to="/goals" className="text-primary-600 hover:text-primary-700 text-sm">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {goals.map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-secondary-900">{goal.name}</h4>
                            <span className="text-sm text-secondary-600">
                              ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-2.5">
                            <div
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-secondary-500">
                            <span>{progress.toFixed(0)}% complete</span>
                            <span className="flex items-center">
                              <FiCalendar className="mr-1" />
                              Due {new Date(goal.deadline).toLocaleDateString()}
                            </span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
