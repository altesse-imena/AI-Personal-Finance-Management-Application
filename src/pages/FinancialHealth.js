import React, { useState, useEffect } from 'react';
import { FiInfo, FiArrowUp, FiArrowDown, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const FinancialHealth = () => {
  const { userProfile, transactions, goals } = useFinance();
  const [healthScore, setHealthScore] = useState(0);
  const [healthMetrics, setHealthMetrics] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate financial health score
  useEffect(() => {
    if (!userProfile || isLoading) return;

    // Simulate calculation delay
    const timer = setTimeout(() => {
      calculateFinancialHealth();
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userProfile, transactions, goals]);

  const calculateFinancialHealth = () => {
    // Extract financial data
    const income = userProfile?.financialSummary?.income || 0;
    const expenses = userProfile?.financialSummary?.expenses || 0;
    const balance = userProfile?.financialSummary?.balance || 0;
    const savings = userProfile?.financialSummary?.savings || 0;

    // Calculate metrics
    const metrics = {};
    
    // 1. Emergency Fund Ratio (savings / monthly expenses)
    // Ideal: 3-6 months of expenses
    const emergencyFundRatio = expenses > 0 ? savings / expenses : 0;
    const emergencyFundScore = Math.min(100, (emergencyFundRatio / 6) * 100);
    metrics.emergencyFund = {
      score: emergencyFundScore,
      value: emergencyFundRatio.toFixed(1),
      label: 'Emergency Fund',
      description: 'Months of expenses covered by savings',
      recommendation: emergencyFundRatio < 3 
        ? 'Aim to save at least 3-6 months of expenses for emergencies'
        : 'Your emergency fund is in good shape',
      status: emergencyFundRatio >= 3 ? 'good' : emergencyFundRatio >= 1 ? 'warning' : 'poor'
    };

    // 2. Savings Rate (savings / income)
    // Ideal: At least 20%
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const savingsRateScore = Math.min(100, (savingsRate / 20) * 100);
    metrics.savingsRate = {
      score: savingsRateScore,
      value: savingsRate.toFixed(1) + '%',
      label: 'Savings Rate',
      description: 'Percentage of income saved',
      recommendation: savingsRate < 20 
        ? 'Try to save at least 20% of your income'
        : 'Your savings rate is excellent',
      status: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'warning' : 'poor'
    };

    // 3. Debt-to-Income Ratio (monthly debt payments / monthly income)
    // Ideal: Below 36%
    // For this mock, we'll assume 30% of expenses are debt payments
    const debtPayments = expenses * 0.3;
    const debtToIncomeRatio = income > 0 ? (debtPayments / income) * 100 : 0;
    const debtToIncomeScore = Math.min(100, (1 - (debtToIncomeRatio / 36)) * 100);
    metrics.debtToIncome = {
      score: debtToIncomeScore,
      value: debtToIncomeRatio.toFixed(1) + '%',
      label: 'Debt-to-Income Ratio',
      description: 'Percentage of income going to debt payments',
      recommendation: debtToIncomeRatio > 36 
        ? 'Work on reducing your debt to below 36% of your income'
        : 'Your debt-to-income ratio is healthy',
      status: debtToIncomeRatio <= 36 ? 'good' : debtToIncomeRatio <= 43 ? 'warning' : 'poor'
    };

    // 4. Spending Ratio (expenses / income)
    // Ideal: Below 80%
    const spendingRatio = income > 0 ? (expenses / income) * 100 : 0;
    const spendingRatioScore = Math.min(100, (1 - (spendingRatio / 80)) * 100);
    metrics.spendingRatio = {
      score: spendingRatioScore,
      value: spendingRatio.toFixed(1) + '%',
      label: 'Spending Ratio',
      description: 'Percentage of income spent',
      recommendation: spendingRatio > 80 
        ? 'Try to reduce your spending to below 80% of your income'
        : 'Your spending is well-controlled',
      status: spendingRatio <= 80 ? 'good' : spendingRatio <= 90 ? 'warning' : 'poor'
    };

    // 5. Goal Progress (average progress across all goals)
    let goalProgressScore = 0;
    if (goals && goals.length > 0) {
      const totalProgress = goals.reduce((sum, goal) => {
        return sum + (goal.currentAmount / goal.targetAmount);
      }, 0);
      goalProgressScore = (totalProgress / goals.length) * 100;
    }
    metrics.goalProgress = {
      score: goalProgressScore,
      value: goalProgressScore.toFixed(1) + '%',
      label: 'Goal Progress',
      description: 'Average progress towards financial goals',
      recommendation: goalProgressScore < 50 
        ? 'Consider allocating more resources to your financial goals'
        : 'You\'re making good progress on your goals',
      status: goalProgressScore >= 50 ? 'good' : goalProgressScore >= 25 ? 'warning' : 'poor'
    };

    // Calculate overall health score (weighted average)
    const weights = {
      emergencyFund: 0.25,
      savingsRate: 0.2,
      debtToIncome: 0.25,
      spendingRatio: 0.2,
      goalProgress: 0.1
    };

    const overallScore = Object.keys(metrics).reduce((score, key) => {
      return score + (metrics[key].score * weights[key]);
    }, 0);

    setHealthScore(Math.round(overallScore));
    setHealthMetrics(metrics);

    // Generate recommendations
    const allRecommendations = Object.values(metrics)
      .filter(metric => metric.status !== 'good')
      .map(metric => metric.recommendation);
    
    // Add additional recommendations if needed
    if (allRecommendations.length < 3) {
      if (!allRecommendations.some(rec => rec.includes('automate'))) {
        allRecommendations.push('Set up automatic transfers to your savings account to make saving easier');
      }
      if (!allRecommendations.some(rec => rec.includes('budget'))) {
        allRecommendations.push('Create a detailed budget to track and control your spending');
      }
      if (!allRecommendations.some(rec => rec.includes('review'))) {
        allRecommendations.push('Review your subscriptions and recurring expenses to identify potential savings');
      }
    }
    
    setRecommendations(allRecommendations.slice(0, 5));
  };

  // Get health score category and color
  const getHealthCategory = (score) => {
    if (score >= 80) return { category: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (score >= 70) return { category: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    if (score >= 60) return { category: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (score >= 40) return { category: 'Needs Improvement', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { category: 'Poor', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const healthCategory = getHealthCategory(healthScore);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-secondary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 mb-8">
            Financial Health Score
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Calculating your financial health score...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-secondary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 mb-8">
          Financial Health Score
        </h1>
        
        {/* Score Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <svg className="w-48 h-48">
                  <circle
                    className="text-secondary-100"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className={healthCategory.bgColor}
                    strokeWidth="10"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * healthScore) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{healthScore}</span>
                  <span className="text-secondary-500 text-sm">out of 100</span>
                </div>
              </div>
              <h2 className={`text-2xl font-bold mt-4 ${healthCategory.color}`}>
                {healthCategory.category}
              </h2>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-secondary-800 mb-4">Your Financial Health</h3>
              <p className="text-secondary-600 mb-4">
                Your financial health score is a holistic measure of your financial well-being. It takes into account your savings, spending habits, debt management, and progress towards your financial goals.
              </p>
              <div className="flex items-center text-sm">
                <FiInfo className="text-primary-600 mr-2" />
                <span className="text-secondary-500">
                  This score is updated whenever your financial data changes.
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Metrics Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary-800 mb-6">Metrics Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(healthMetrics).map(key => {
              const metric = healthMetrics[key];
              const metricCategory = metric.status === 'good' 
                ? { color: 'text-green-500', icon: <FiCheckCircle /> } 
                : metric.status === 'warning' 
                  ? { color: 'text-yellow-500', icon: <FiAlertCircle /> }
                  : { color: 'text-red-500', icon: <FiAlertCircle /> };
              
              return (
                <div key={key} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-secondary-800">{metric.label}</h3>
                      <p className="text-sm text-secondary-500">{metric.description}</p>
                    </div>
                    <div className={`flex items-center ${metricCategory.color}`}>
                      {metricCategory.icon}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm font-medium">Score: {Math.round(metric.score)}/100</span>
                  </div>
                  
                  <div className="w-full bg-secondary-100 rounded-full h-2.5 mb-3">
                    <div 
                      className={`h-2.5 rounded-full ${
                        metric.score >= 70 ? 'bg-green-500' : 
                        metric.score >= 50 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-secondary-600">{metric.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Personalized Recommendations</h2>
          
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-3 bg-secondary-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                  {index + 1}
                </div>
                <p className="text-secondary-700">{recommendation}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 border border-primary-100 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-700 mb-2">Next Steps to Improve Your Score</h3>
            <p className="text-primary-600 mb-3">
              Focus on the metrics where you scored the lowest. Even small improvements in these areas can significantly boost your overall financial health.
            </p>
            <ul className="list-disc list-inside text-primary-600 space-y-1">
              <li>Review your budget and look for ways to reduce unnecessary expenses</li>
              <li>Set up automatic transfers to build your emergency fund</li>
              <li>Create a debt repayment plan if your debt-to-income ratio is high</li>
              <li>Track your progress regularly and adjust your strategy as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
