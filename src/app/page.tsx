'use client'

import Link from 'next/link'
import { PlusCircle, TrendingUp, Calendar, CreditCard, User, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import SpendingChart from '@/components/SpendingChart';
import MonthlyTrend from '@/components/MonthlyTrend';
import TopCategories from '@/components/TopCategories';
import DateRangePicker from '@/components/DateRangePicker';

export default function Dashboard() {
  const { expenses, categories } = useStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState('all');
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const [filteredTotal, setFilteredTotal] = useState(totalExpenses);

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      useStore.getState().loadData();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        router.push('/auth/signin');
      }
    } catch {
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Cheqa</h1>
          <p className="text-gray-600 mb-8">Your personal expense tracker</p>
          <div className="space-x-4">
            <Link href="/auth/signin" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-gray-800">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 text-gray-800">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const thisMonth = new Date()
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.expenseDate)
      return expenseDate.getMonth() === thisMonth.getMonth() && 
             expenseDate.getFullYear() === thisMonth.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)
  
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount).replace('ZAR', 'R')
  }

  const handleFilterChange = (range: 'all' | 'day' | 'week' | 'month' | 'year') => {
    const now = new Date();
    let filtered = expenses;
  
    if (range === 'day') {
      filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        return expenseDate.toDateString() === now.toDateString();
      });
    } else if (range === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        return expenseDate >= weekAgo && expenseDate <= now;
      });
    } else if (range === 'month') {
      filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (range === 'year') {
      filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        return expenseDate.getFullYear() === now.getFullYear();
      });
    }
  
    setFilteredExpenses(filtered);
    setFilteredTotal(filtered.reduce((sum, expense) => sum + expense.amount, 0));
    setFilterRange(range);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Ensure all dates are valid before comparison
      return (
        !isNaN(expenseDate.getTime()) &&
        !isNaN(start.getTime()) &&
        !isNaN(end.getTime()) &&
        expenseDate >= start && expenseDate <= end
      );
    });
  
    setFilteredExpenses(filtered);
    setFilteredTotal(filtered.reduce((sum, expense) => sum + expense.amount, 0));
  };

  // Update the 'This Month' calculation to use filteredExpenses
  const filteredMonthlyExpenses = filteredExpenses
    .filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      return (
        expenseDate.getMonth() === thisMonth.getMonth() &&
        expenseDate.getFullYear() === thisMonth.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Update the 'Categories' count to reflect filteredExpenses
  const filteredCategories = new Set(filteredExpenses.map(expense => expense.categoryId)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Cheqa</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/expenses" className="text-gray-700 hover:text-gray-900">
                Expenses
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-700 hover:text-gray-900">
                Payment Methods
              </Link>
              <div className="flex items-center space-x-2 border-l pl-4">
                <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="hidden lg:inline text-gray-700">{user.name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                <User className="h-5 w-5" />
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0] || 'User'}!</h2>
            <p className="text-gray-600">Here's your expense overview</p>
          </div>

          <div className="mb-6">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-2">Filter by Date Range:</label>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        Total Expenses
                      </dt>
                      <dd className="text-sm sm:text-lg font-medium text-gray-900">
                        {formatCurrency(totalExpenses)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        This Month
                      </dt>
                      <dd className="text-sm sm:text-lg font-medium text-gray-900">
                        {formatCurrency(filteredMonthlyExpenses)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        Categories
                      </dt>
                      <dd className="text-sm sm:text-lg font-medium text-gray-900">
                        {filteredCategories}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <Link
                  href="/expenses/create"
                  className="flex flex-col sm:flex-row items-center justify-center w-full h-full text-blue-600 hover:text-blue-800 space-y-1 sm:space-y-0 sm:space-x-2"
                >
                  <PlusCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                  <span className="text-sm sm:text-base font-medium">Add Expense</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Filtered Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(filteredTotal)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SpendingChart expenses={filteredExpenses} categories={categories} />
              <MonthlyTrend expenses={filteredExpenses} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Expenses
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your latest expense entries
                </p>
              </div>
              <div className="border-t border-gray-200">
                {recentExpenses.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No expenses yet. <Link href="/expenses/create" className="text-blue-600 hover:text-blue-800">Add your first expense</Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentExpenses.map((expense) => {
                      const category = categories.find(c => c.id === expense.categoryId);
                      return (
                        <li key={expense.id} className="px-4 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                              <p className="text-sm text-gray-500">{category?.name} • {new Date(expense.expenseDate).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            
            <TopCategories expenses={expenses} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}