import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFinance } from '../contexts/FinanceContext';
import { FiUser, FiBell, FiLock, FiDollarSign, FiCreditCard, FiToggleLeft, FiToggleRight, FiSave } from 'react-icons/fi';

const Settings = () => {
  const { currentUser, logout, updateEmail, updatePassword } = useAuth();
  const { userProfile, updateProfile } = useFinance();
  
  // Form states
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Account settings
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  
  // Financial settings
  const [currency, setCurrency] = useState('USD');
  const [budgetStartDay, setBudgetStartDay] = useState('1');
  const [defaultCategory, setDefaultCategory] = useState('Uncategorized');
  
  // App settings
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [autoLogout, setAutoLogout] = useState('30');
  
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setDisplayName(currentUser.displayName || '');
    }
    
    if (userProfile) {
      // Load user preferences if available
      const preferences = userProfile.preferences || {};
      setEmailNotifications(preferences.emailNotifications !== false);
      setWeeklyReports(preferences.weeklyReports !== false);
      setBudgetAlerts(preferences.budgetAlerts !== false);
      setGoalReminders(preferences.goalReminders !== false);
      setCurrency(preferences.currency || 'USD');
      setBudgetStartDay(preferences.budgetStartDay || '1');
      setDefaultCategory(preferences.defaultCategory || 'Uncategorized');
      setDarkMode(preferences.darkMode || false);
      setCompactView(preferences.compactView || false);
      setAutoLogout(preferences.autoLogout || '30');
    }
  }, [currentUser, userProfile]);
  
  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update display name in profile
      await updateProfile({ displayName });
      
      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(email);
      }
      
      setSuccess('Account information updated successfully');
    } catch (err) {
      setError('Failed to update account information: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await updatePassword(newPassword);
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const preferences = {
        emailNotifications,
        weeklyReports,
        budgetAlerts,
        goalReminders,
        currency,
        budgetStartDay,
        defaultCategory,
        darkMode,
        compactView,
        autoLogout
      };
      
      await updateProfile({ preferences });
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Profile Information</h3>
        <form onSubmit={handleAccountUpdate} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-secondary-700 mb-1">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
      
      {/* Password */}
      <div className="card bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-700 mb-1">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="btn btn-primary"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
  
  const renderNotificationSettings = () => (
    <div className="card bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Notification Preferences</h3>
      <form onSubmit={handlePreferencesUpdate} className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-secondary-100">
          <div>
            <h4 className="font-medium text-secondary-900">Email Notifications</h4>
            <p className="text-sm text-secondary-500">Receive emails about your account activity</p>
          </div>
          <button 
            type="button" 
            onClick={() => setEmailNotifications(!emailNotifications)}
            className="text-2xl text-primary-600"
          >
            {emailNotifications ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-secondary-100">
          <div>
            <h4 className="font-medium text-secondary-900">Weekly Reports</h4>
            <p className="text-sm text-secondary-500">Receive weekly summaries of your financial activity</p>
          </div>
          <button 
            type="button" 
            onClick={() => setWeeklyReports(!weeklyReports)}
            className="text-2xl text-primary-600"
          >
            {weeklyReports ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-secondary-100">
          <div>
            <h4 className="font-medium text-secondary-900">Budget Alerts</h4>
            <p className="text-sm text-secondary-500">Get notified when you're approaching budget limits</p>
          </div>
          <button 
            type="button" 
            onClick={() => setBudgetAlerts(!budgetAlerts)}
            className="text-2xl text-primary-600"
          >
            {budgetAlerts ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-secondary-900">Goal Reminders</h4>
            <p className="text-sm text-secondary-500">Get reminded about your savings goals progress</p>
          </div>
          <button 
            type="button" 
            onClick={() => setGoalReminders(!goalReminders)}
            className="text-2xl text-primary-600"
          >
            {goalReminders ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </form>
    </div>
  );
  
  const renderFinancialSettings = () => (
    <div className="card bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Financial Settings</h3>
      <form onSubmit={handlePreferencesUpdate} className="space-y-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-secondary-700 mb-1">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budgetStartDay" className="block text-sm font-medium text-secondary-700 mb-1">Budget Start Day</label>
          <select
            id="budgetStartDay"
            value={budgetStartDay}
            onChange={(e) => setBudgetStartDay(e.target.value)}
            className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          >
            {[...Array(28)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
            ))}
          </select>
          <p className="text-xs text-secondary-500 mt-1">The day of the month when your budget cycle starts</p>
        </div>
        
        <div>
          <label htmlFor="defaultCategory" className="block text-sm font-medium text-secondary-700 mb-1">Default Transaction Category</label>
          <select
            id="defaultCategory"
            value={defaultCategory}
            onChange={(e) => setDefaultCategory(e.target.value)}
            className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Housing">Housing</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Shopping">Shopping</option>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? 'Saving...' : 'Save Financial Settings'}
        </button>
      </form>
    </div>
  );
  
  const renderAppSettings = () => (
    <div className="card bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Application Settings</h3>
      <form onSubmit={handlePreferencesUpdate} className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-secondary-100">
          <div>
            <h4 className="font-medium text-secondary-900">Dark Mode</h4>
            <p className="text-sm text-secondary-500">Use dark theme for the application</p>
          </div>
          <button 
            type="button" 
            onClick={() => setDarkMode(!darkMode)}
            className="text-2xl text-primary-600"
          >
            {darkMode ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-secondary-100">
          <div>
            <h4 className="font-medium text-secondary-900">Compact View</h4>
            <p className="text-sm text-secondary-500">Show more content with less spacing</p>
          </div>
          <button 
            type="button" 
            onClick={() => setCompactView(!compactView)}
            className="text-2xl text-primary-600"
          >
            {compactView ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        
        <div>
          <label htmlFor="autoLogout" className="block text-sm font-medium text-secondary-700 mb-1">Auto Logout (minutes)</label>
          <select
            id="autoLogout"
            value={autoLogout}
            onChange={(e) => setAutoLogout(e.target.value)}
            className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? 'Saving...' : 'Save App Settings'}
        </button>
      </form>
    </div>
  );
  
  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Settings</h1>
        
        {/* Success and Error Messages */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FiSave className="text-green-500 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FiSave className="text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex items-center px-4 py-3 text-left ${activeTab === 'account' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-secondary-700 hover:bg-secondary-50'}`}
                >
                  <FiUser className="mr-3" />
                  Account
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center px-4 py-3 text-left ${activeTab === 'notifications' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-secondary-700 hover:bg-secondary-50'}`}
                >
                  <FiBell className="mr-3" />
                  Notifications
                </button>
                
                <button
                  onClick={() => setActiveTab('financial')}
                  className={`flex items-center px-4 py-3 text-left ${activeTab === 'financial' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-secondary-700 hover:bg-secondary-50'}`}
                >
                  <FiDollarSign className="mr-3" />
                  Financial
                </button>
                
                <button
                  onClick={() => setActiveTab('app')}
                  className={`flex items-center px-4 py-3 text-left ${activeTab === 'app' ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-secondary-700 hover:bg-secondary-50'}`}
                >
                  <FiCreditCard className="mr-3" />
                  App Settings
                </button>
              </nav>
            </div>
          </div>
          
          {/* Settings Content */}
          <div className="md:col-span-3">
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'financial' && renderFinancialSettings()}
            {activeTab === 'app' && renderAppSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
