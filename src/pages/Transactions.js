import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiFilter, FiDownload, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFinance } from '../contexts/FinanceContext';

const Transactions = () => {
  const { transactions, isLoading, error, refreshTransactions } = useFinance();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))];

  // Apply filters to transactions
  useEffect(() => {
    let results = [...transactions];
    
    // Filter by type
    if (filters.type !== 'all') {
      results = results.filter(t => t.type === filters.type);
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      results = results.filter(t => t.category === filters.category);
    }
    
    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      results = results.filter(t => new Date(t.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      results = results.filter(t => new Date(t.date) <= endDate);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTransactions();
    setIsRefreshing(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Export transactions as CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvData = [
      headers.join(','),
      ...filteredTransactions.map(t => {
        const date = new Date(t.date).toLocaleDateString();
        const amount = t.amount.toFixed(2);
        return [date, t.description, t.category, amount, t.type].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-secondary-900">Transactions</h1>
            <button 
              onClick={handleRefresh} 
              className="ml-4 p-2 rounded-full hover:bg-secondary-100 transition-colors"
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`text-secondary-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={exportToCSV}
              className="btn btn-secondary flex items-center"
              disabled={filteredTransactions.length === 0}
            >
              <FiDownload className="mr-2" /> Export CSV
            </button>
            <Link to="/transactions/new" className="btn btn-primary flex items-center">
              <FiPlus className="mr-2" /> Add Transaction
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-white rounded-xl shadow-stripe-sm mb-8">
          <div className="flex items-center mb-4">
            <FiFilter className="text-secondary-600 mr-2" />
            <h2 className="text-xl font-semibold text-secondary-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Search</label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search description or category"
                className="input w-full"
              />
            </div>
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
        ) : filteredTransactions.length === 0 ? (
          <div className="card bg-white rounded-xl shadow-stripe-sm p-8 text-center">
            <p className="text-xl text-secondary-600">No transactions found matching your filters.</p>
          </div>
        ) : (
          <>
            {/* Transactions Table */}
            <div className="card bg-white rounded-xl shadow-stripe-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-100">
                    {currentItems.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-secondary-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          {transaction.category}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-secondary-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="text-secondary-600" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-md border ${currentPage === pageNum ? 'bg-primary-600 text-white border-primary-600' : 'border-secondary-300 text-secondary-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="text-secondary-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
