import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Register = ({ setIsAuthenticated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would create a new user account
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="bg-secondary-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold">
                <span className="text-primary-600">Locked</span>
                <span className="text-secondary-800">IN</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-secondary-900 mt-6">Create your account</h1>
            <p className="text-secondary-600 mt-2">Start your financial journey today</p>
          </div>

          <div className="card bg-white rounded-xl shadow-stripe-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="label mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-secondary-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className="input pl-10"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="label mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-secondary-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="label mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-secondary-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-secondary-500">
                  Must be at least 8 characters with a number and a special character
                </p>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Create account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
