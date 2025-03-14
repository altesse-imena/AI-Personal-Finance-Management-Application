import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="medium" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <SignedIn>
              <>
                <Link to="/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/goals" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Goals
                </Link>
                <Link to="/transactions" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Transactions
                </Link>
                <Link to="/insights" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Insights
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors">
                    <FiUser className="mr-1" />
                    {user?.firstName || 'Account'}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link to="/settings" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </>
            </SignedIn>
            <SignedOut>
              <>
                <Link to="/sign-in" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/sign-up" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-secondary-600 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <SignedIn>
              <>
                <Link
                  to="/dashboard"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/goals"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Goals
                </Link>
                <Link
                  to="/transactions"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Transactions
                </Link>
                <Link
                  to="/insights"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Insights
                </Link>
                <Link
                  to="/settings"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            </SignedIn>
            <SignedOut>
              <>
                <Link
                  to="/sign-in"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="btn btn-primary w-full text-center"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
