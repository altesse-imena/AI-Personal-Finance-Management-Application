import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiTarget, FiTrendingUp, FiShield } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              Take control of your financial future
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              <span className="font-semibold">
                <span className="text-primary-600">Locked</span>
                <span className="text-secondary-800">IN</span>
              </span> uses AI to provide personalized financial recommendations based on your goals and spending habits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/sign-up" className="btn btn-primary px-8 py-3 text-base">
                Get Started
              </Link>
              <Link to="/sign-in" className="btn btn-secondary px-8 py-3 text-base">
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-stripe">
              <img 
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                alt="Locked·IN Dashboard Preview" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 to-transparent opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Simplify your financial journey
            </h2>
            <p className="text-xl text-secondary-600">
              Our AI-powered tools help you set goals, track progress, and make smarter financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <FiTarget className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Goal Setting
              </h3>
              <p className="text-secondary-600 mb-4">
                Set personalized financial goals and get AI-powered recommendations on how to achieve them.
              </p>
              <Link to="/features" className="inline-flex items-center text-primary-600 hover:text-primary-700">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <FiBarChart2 className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Expense Tracking
              </h3>
              <p className="text-secondary-600 mb-4">
                Easily log and categorize your expenses to understand your spending habits and identify areas for improvement.
              </p>
              <Link to="/features" className="inline-flex items-center text-primary-600 hover:text-primary-700">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <FiTrendingUp className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Investment Recommendations
              </h3>
              <p className="text-secondary-600 mb-4">
                Get personalized ETF and investment recommendations based on your risk tolerance and financial goals.
              </p>
              <Link to="/features" className="inline-flex items-center text-primary-600 hover:text-primary-700">
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How LockedIn works
            </h2>
            <p className="text-xl text-secondary-600">
              Our simple process helps you take control of your finances in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Set your financial goals
              </h3>
              <p className="text-secondary-600">
                Define what you want to achieve, whether it's saving for a vacation, paying off debt, or investing for retirement.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Track your expenses
              </h3>
              <p className="text-secondary-600">
                Log your income and expenses to give our AI a clear picture of your financial habits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Get personalized recommendations
              </h3>
              <p className="text-secondary-600">
                Receive AI-powered advice on saving, budgeting, and investing to help you reach your goals faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              What our users say
            </h2>
            <p className="text-xl text-secondary-600">
              Join thousands of people who have transformed their financial lives with LockedIn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Jane Doe</h4>
                  <p className="text-sm text-secondary-500">Saved $10,000 in 6 months</p>
                </div>
              </div>
              <p className="text-secondary-600">
                "LockedIn helped me save for my dream vacation. The AI recommendations were spot-on and helped me cut unnecessary expenses I didn't even realize I had."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">John Smith</h4>
                  <p className="text-sm text-secondary-500">Paid off $25,000 in debt</p>
                </div>
              </div>
              <p className="text-secondary-600">
                "The budgeting tools and debt repayment strategies from LockedIn helped me become debt-free in just 18 months. I couldn't have done it without this app."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-8 shadow-stripe-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">AJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Alex Johnson</h4>
                  <p className="text-sm text-secondary-500">Growing retirement portfolio</p>
                </div>
              </div>
              <p className="text-secondary-600">
                "The investment recommendations have been incredible. My retirement portfolio has grown 15% more than it would have with my previous strategy."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join LockedIn today and start your journey toward financial freedom.
            </p>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 text-base">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
