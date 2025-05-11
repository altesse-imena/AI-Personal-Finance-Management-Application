import React, { useState, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const Insights = () => {
  const { goals, getInsights } = useFinance();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        const insightsData = await getInsights(timeFrame);
        setInsights(insightsData);
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [getInsights, timeFrame]);

  // Generate mock data for visualizations if insights aren't available yet
  const generateMockData = () => {
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
  };

  const data = insights || generateMockData();

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Spending by Category</h3>
        <div className="h-64">
          <Pie data={data.spendingByCategory} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Financial Health Score</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-primary-600">{data.financialHealth}%</div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="10"
                strokeDasharray={`${data.financialHealth * 2.83} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <p className="text-secondary-600 mt-4">
            {data.financialHealth >= 80
              ? 'Excellent financial health!'
              : data.financialHealth >= 60
              ? 'Good financial health'
              : 'Needs improvement'}
          </p>
        </div>
      </div>

      <div className="card bg-white rounded-xl shadow-sm p-6 md:col-span-2">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Smart Recommendations</h3>
        <div className="space-y-4">
          {data && data.recommendations && data.recommendations.map ? (
            data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-3 bg-secondary-50 rounded-lg">
                {recommendation.includes('higher') ? (
                  <FiTrendingUp className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                ) : recommendation.includes('track') ? (
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                )}
                <p className="text-secondary-700">{recommendation}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-secondary-600">No recommendations available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSpending = () => (
    <div className="space-y-6">
      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Monthly Income vs. Spending</h3>
        <div className="h-80">
          <Bar
            data={data.monthlySpending}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    borderDash: [2, 4],
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Top Expense</h3>
            <FiDollarSign className="text-primary-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 mt-2">Housing</p>
          <p className="text-secondary-600">35% of total spending</p>
        </div>

        <div className="card bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Biggest Increase</h3>
            <FiTrendingUp className="text-red-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 mt-2">Food</p>
          <p className="text-secondary-600">+15% from last month</p>
        </div>

        <div className="card bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Biggest Decrease</h3>
            <FiTrendingDown className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 mt-2">Entertainment</p>
          <p className="text-secondary-600">-8% from last month</p>
        </div>
      </div>
    </div>
  );

  const renderSavings = () => (
    <div className="space-y-6">
      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Savings Growth</h3>
        <div className="h-80">
          <Line
            data={data.savingsProgress}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    borderDash: [2, 4],
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Savings Goals Progress</h3>
          <div className="space-y-4">
            {goals && goals.length > 0 ? (
              goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-secondary-700">{goal.name}</span>
                      <span className="text-sm text-secondary-600">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-secondary-100 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary-600">No savings goals found. Create goals to track your progress!</p>
            )}
          </div>
        </div>

        <div className="card bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Savings Opportunities</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start">
                <FiTarget className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Refinance Loans</h4>
                  <p className="text-green-700 mt-1">You could save $120/month by refinancing your current loans at a lower interest rate.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-start">
                <FiTarget className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Subscription Audit</h4>
                  <p className="text-amber-700 mt-1">We found $45/month in potentially unused subscriptions that you could cancel.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
              <div className="flex items-start">
                <FiTarget className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-primary-800">Automate Savings</h4>
                  <p className="text-primary-700 mt-1">Setting up automatic transfers of $200/month could help you reach your vacation goal 2 months sooner.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Financial Insights</h1>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="form-select rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-secondary-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('spending')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'spending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Spending Analysis
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'savings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Savings & Goals
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="mb-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'spending' && renderSpending()}
            {activeTab === 'savings' && renderSavings()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
