import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiDollarSign, FiCreditCard, FiBarChart2, FiRepeat } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { darkMode } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:text-white transition-colors duration-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="medium" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-6">
                  <Link to="/dashboard" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Dashboard</Link>
                  <Link to="/transactions" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Transactions</Link>
                  <Link to="/goals" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Goals</Link>
                  <Link to="/insights" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Insights</Link>
                  <Link to="/budget" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Budget</Link>
                  <Link to="/subscriptions" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Subscriptions</Link>
                </div>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 focus:outline-none dark:text-white dark:hover:text-primary-400"
                  >
                    <FiUser className="mr-1" />
                    <span>{currentUser.email?.split('@')[0] || 'Account'}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-gray-700">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center dark:text-white dark:hover:bg-gray-600"
                      >
                        <FiUser className="mr-2" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center dark:text-white dark:hover:bg-gray-600"
                      >
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signin" className="text-secondary-700 hover:text-primary-600 font-medium dark:text-white dark:hover:text-primary-400">Sign In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-secondary-700 hover:text-primary-600 focus:outline-none dark:text-white dark:hover:text-primary-400"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-inner dark:bg-gray-800">
          <div className="flex flex-col space-y-3">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Dashboard</Link>
                <Link to="/transactions" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Transactions</Link>
                <Link to="/goals" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Goals</Link>
                <Link to="/insights" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Insights</Link>
                <Link to="/budget" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Budget</Link>
                <Link to="/subscriptions" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Subscriptions</Link>
                <Link to="/financial-health" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Financial Health</Link>
                <Link to="/recurring-transactions" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Recurring</Link>
                <div className="border-t border-secondary-100 dark:border-gray-700 my-2"></div>
                <Link to="/settings" className="text-secondary-700 hover:text-primary-600 font-medium py-2 flex items-center dark:text-white dark:hover:text-primary-400">
                  <FiUser className="mr-2" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-secondary-700 hover:text-primary-600 font-medium py-2 flex items-center w-full text-left dark:text-white dark:hover:text-primary-400"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Sign In</Link>
                <Link to="/signup" className="text-secondary-700 hover:text-primary-600 font-medium py-2 dark:text-white dark:hover:text-primary-400">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
