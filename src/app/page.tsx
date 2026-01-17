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
import HeroSection from '@/components/HeroSection';
import ThemeToggle from '@/components/ThemeToggle';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function Dashboard() {
  const { expenses, categories } = useStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState('all');
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null
  });

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

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredExpenses(expenses);
      setFilteredTotal(expenses.reduce((sum, expense) => sum + expense.amount, 0));
    }
  }, [expenses, dateRange.startDate, dateRange.endDate]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
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
    return <HeroSection />;
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
    if (!startDate || !endDate) {
      setDateRange({ startDate: null, endDate: null });
      setFilteredExpenses(expenses);
      setFilteredTotal(expenses.reduce((sum, expense) => sum + expense.amount, 0));
      return;
    }

    setDateRange({ startDate, endDate });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Cheqa</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/expenses" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Expenses
              </Link>
              <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Payment Methods
              </Link>
              <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4">
                <Link href="/profile" className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="hidden lg:inline text-gray-600 dark:text-gray-400">{user.name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <ThemeToggle />
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                <User className="h-5 w-5" />
              </Link>
              <button onClick={handleLogout} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                <LogOut className="h-4 w-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Here's your expense overview</p>
          </div>

          <div className="mb-6">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Filter by Date Range:
            </label>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>

          <RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          Total Expenses
                        </dt>
                        <dd className="text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(totalExpenses)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                        This Month
                      </dt>
                      <dd className="text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(filteredMonthlyExpenses)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                        Categories
                      </dt>
                      <dd className="text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                        {filteredCategories}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="p-4 sm:p-5">
                <Link
                  href="/expenses/create"
                  className="flex flex-col sm:flex-row items-center justify-center w-full h-full text-blue-600 dark:text-blue-400 hover:opacity-90 space-y-1 sm:space-y-0 sm:space-x-2"
                >
                  <PlusCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                  <span className="text-sm sm:text-base font-medium">Add Expense</span>
                </Link>
              </div>
            </div>
          </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                        Filtered Total
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(filteredTotal)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Analytics Section */}
          {expenses.length > 0 && (
            <RevealOnScroll>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SpendingChart expenses={filteredExpenses} categories={categories} />
                <MonthlyTrend expenses={filteredExpenses} dateRange={dateRange} />
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    Recent Expenses
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                    Your latest expense entries
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {recentExpenses.length === 0 ? (
                    <div className="px-4 py-5 sm:p-6 text-center text-gray-600 dark:text-gray-400">
                      No expenses yet.{' '}
                      <Link href="/expenses/create" className="text-blue-600 dark:text-blue-400 hover:opacity-90">
                        Add your first expense
                      </Link>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentExpenses.map((expense) => {
                        const category = categories.find(c => c.id === expense.categoryId);
                        return (
                          <li key={expense.id} className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.description}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {category?.name} • {new Date(expense.expenseDate).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrency(expense.amount)}
                              </p>
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
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
