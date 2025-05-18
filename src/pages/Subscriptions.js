import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiCalendar, FiClock, FiDollarSign, FiTag } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const Subscriptions = () => {
  const { userProfile } = useFinance();
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    category: '',
    nextBillingDate: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock subscription data - in a real app, this would come from Firebase
  useEffect(() => {
    // Simulate loading subscriptions from a service
    const mockSubscriptions = [
      { 
        id: 's1', 
        name: 'Netflix', 
        amount: 15.99, 
        billingCycle: 'monthly', 
        category: 'Entertainment',
        nextBillingDate: new Date(2025, 5, 15),
        description: 'Standard HD plan',
        logo: 'https://logo.clearbit.com/netflix.com'
      },
      { 
        id: 's2', 
        name: 'Spotify', 
        amount: 9.99, 
        billingCycle: 'monthly', 
        category: 'Entertainment',
        nextBillingDate: new Date(2025, 5, 20),
        description: 'Premium subscription',
        logo: 'https://logo.clearbit.com/spotify.com'
      },
      { 
        id: 's3', 
        name: 'Adobe Creative Cloud', 
        amount: 52.99, 
        billingCycle: 'monthly', 
        category: 'Software',
        nextBillingDate: new Date(2025, 5, 10),
        description: 'All apps plan',
        logo: 'https://logo.clearbit.com/adobe.com'
      },
      { 
        id: 's4', 
        name: 'Amazon Prime', 
        amount: 139, 
        billingCycle: 'yearly', 
        category: 'Shopping',
        nextBillingDate: new Date(2025, 11, 15),
        description: 'Annual membership',
        logo: 'https://logo.clearbit.com/amazon.com'
      },
      { 
        id: 's5', 
        name: 'Gym Membership', 
        amount: 45, 
        billingCycle: 'monthly', 
        category: 'Health',
        nextBillingDate: new Date(2025, 5, 1),
        description: 'Basic membership',
        logo: null
      }
    ];
    
    setSubscriptions(mockSubscriptions);
  }, []);

  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount || !newSubscription.nextBillingDate) return;
    
    const subscription = {
      id: `s${Date.now()}`,
      name: newSubscription.name,
      amount: Number(newSubscription.amount),
      billingCycle: newSubscription.billingCycle,
      category: newSubscription.category,
      nextBillingDate: new Date(newSubscription.nextBillingDate),
      description: newSubscription.description,
      logo: `https://logo.clearbit.com/${newSubscription.name.toLowerCase().replace(/\s+/g, '')}.com`
    };
    
    setSubscriptions([...subscriptions, subscription]);
    setNewSubscription({
      name: '',
      amount: '',
      billingCycle: 'monthly',
      category: '',
      nextBillingDate: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateSubscription = () => {
    if (!editingSubscription) return;
    
    const updatedSubscriptions = subscriptions.map(subscription => 
      subscription.id === editingSubscription.id ? {
        ...editingSubscription,
        nextBillingDate: new Date(editingSubscription.nextBillingDate),
        amount: Number(editingSubscription.amount)
      } : subscription
    );
    
    setSubscriptions(updatedSubscriptions);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
  };

  // Calculate monthly and yearly totals
  const calculateTotals = () => {
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    
    subscriptions.forEach(sub => {
      if (sub.billingCycle === 'monthly') {
        monthlyTotal += sub.amount;
        yearlyTotal += sub.amount * 12;
      } else if (sub.billingCycle === 'yearly') {
        monthlyTotal += sub.amount / 12;
        yearlyTotal += sub.amount;
      } else if (sub.billingCycle === 'weekly') {
        monthlyTotal += sub.amount * 4.33; // Average weeks in a month
        yearlyTotal += sub.amount * 52;
      } else if (sub.billingCycle === 'quarterly') {
        monthlyTotal += sub.amount / 3;
        yearlyTotal += sub.amount * 4;
      }
    });
    
    return { monthlyTotal, yearlyTotal };
  };

  const { monthlyTotal, yearlyTotal } = calculateTotals();

  // Filter subscriptions
  const filteredSubscriptions = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.billingCycle === filter);

  // Sort subscriptions by next billing date
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => 
    a.nextBillingDate - b.nextBillingDate
  );

  // Common categories
  const categories = [
    'Entertainment', 'Software', 'Shopping', 'Health', 'Education', 
    'News', 'Music', 'Gaming', 'Utilities', 'Other'
  ];

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days until next billing
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
            Subscription Tracker
          </h1>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center"
            disabled={showAddForm}
          >
            <FiPlus className="mr-2" /> Add Subscription
          </button>
        </div>
        
        {/* Subscription Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Subscription Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Monthly Spending</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                ${monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Yearly Spending</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                ${yearlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-500 text-sm">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-secondary-900">
                {subscriptions.length}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Add Subscription Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-secondary-800">Add New Subscription</h2>
              <button onClick={() => setShowAddForm(false)} className="text-secondary-500 hover:text-secondary-700">
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <input 
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  placeholder="e.g. Netflix"
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
                    value={newSubscription.amount}
                    onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-8 rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Billing Cycle</label>
                <select 
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                <select 
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Next Billing Date</label>
                <input 
                  type="date"
                  value={newSubscription.nextBillingDate}
                  onChange={(e) => setNewSubscription({...newSubscription, nextBillingDate: e.target.value})}
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description (Optional)</label>
                <input 
                  type="text"
                  value={newSubscription.description}
                  onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                  placeholder="e.g. Premium plan"
                  className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleAddSubscription}
                className="btn btn-primary flex items-center"
                disabled={!newSubscription.name || !newSubscription.amount || !newSubscription.nextBillingDate}
              >
                <FiSave className="mr-2" /> Save Subscription
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
            onClick={() => setFilter('monthly')}
            className={`mr-2 px-4 py-2 rounded-lg ${filter === 'monthly' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setFilter('yearly')}
            className={`mr-2 px-4 py-2 rounded-lg ${filter === 'yearly' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Yearly
          </button>
          <button 
            onClick={() => setFilter('weekly')}
            className={`mr-2 px-4 py-2 rounded-lg ${filter === 'weekly' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setFilter('quarterly')}
            className={`px-4 py-2 rounded-lg ${filter === 'quarterly' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-50'}`}
          >
            Quarterly
          </button>
        </div>
        
        {/* Subscription List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Your Subscriptions</h2>
          
          {sortedSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary-500">No subscriptions found. Add your first subscription to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSubscriptions.map(subscription => (
                <div key={subscription.id} className="bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {editingSubscription && editingSubscription.id === subscription.id ? (
                    // Edit mode
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-secondary-800">Edit Subscription</h3>
                        <div className="flex">
                          <button 
                            onClick={handleUpdateSubscription}
                            className="text-primary-600 hover:text-primary-800 mr-2"
                          >
                            <FiSave />
                          </button>
                          <button 
                            onClick={() => setEditingSubscription(null)}
                            className="text-secondary-500 hover:text-secondary-700"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Name</label>
                          <input 
                            type="text"
                            value={editingSubscription.name}
                            onChange={(e) => setEditingSubscription({...editingSubscription, name: e.target.value})}
                            className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Amount</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-secondary-500">$</span>
                            </div>
                            <input 
                              type="number"
                              value={editingSubscription.amount}
                              onChange={(e) => setEditingSubscription({...editingSubscription, amount: e.target.value})}
                              className="w-full pl-8 rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Billing Cycle</label>
                          <select 
                            value={editingSubscription.billingCycle}
                            onChange={(e) => setEditingSubscription({...editingSubscription, billingCycle: e.target.value})}
                            className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Category</label>
                          <select 
                            value={editingSubscription.category}
                            onChange={(e) => setEditingSubscription({...editingSubscription, category: e.target.value})}
                            className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Next Billing Date</label>
                          <input 
                            type="date"
                            value={editingSubscription.nextBillingDate instanceof Date 
                              ? editingSubscription.nextBillingDate.toISOString().split('T')[0] 
                              : new Date(editingSubscription.nextBillingDate).toISOString().split('T')[0]}
                            onChange={(e) => setEditingSubscription({...editingSubscription, nextBillingDate: e.target.value})}
                            className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">Description</label>
                          <input 
                            type="text"
                            value={editingSubscription.description}
                            onChange={(e) => setEditingSubscription({...editingSubscription, description: e.target.value})}
                            className="w-full rounded-lg border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex justify-between items-start p-4">
                        <div className="flex items-center">
                          {subscription.logo ? (
                            <img 
                              src={subscription.logo} 
                              alt={subscription.name} 
                              className="w-12 h-12 rounded-lg mr-3 object-contain bg-white p-1 border border-secondary-100"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48?text=' + subscription.name.charAt(0); }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg mr-3 bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                              {subscription.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-secondary-900">{subscription.name}</h3>
                            <p className="text-sm text-secondary-500">{subscription.description}</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button 
                            onClick={() => setEditingSubscription(subscription)}
                            className="text-primary-600 hover:text-primary-800 mr-2"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            onClick={() => handleDeleteSubscription(subscription.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      
                      <div className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <FiDollarSign className="text-secondary-400 mr-1" />
                            <span className="font-medium">${subscription.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="text-secondary-400 mr-1" />
                            <span>{subscription.billingCycle}</span>
                          </div>
                          <div className="flex items-center">
                            <FiTag className="text-secondary-400 mr-1" />
                            <span>{subscription.category}</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-secondary-400 mr-1" />
                            <span>{formatDate(subscription.nextBillingDate)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          {getDaysUntil(subscription.nextBillingDate) <= 0 ? (
                            <div className="text-red-500 text-sm font-medium">
                              Due today
                            </div>
                          ) : getDaysUntil(subscription.nextBillingDate) <= 3 ? (
                            <div className="text-orange-500 text-sm font-medium">
                              Due in {getDaysUntil(subscription.nextBillingDate)} days
                            </div>
                          ) : (
                            <div className="text-green-500 text-sm font-medium">
                              Due in {getDaysUntil(subscription.nextBillingDate)} days
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
