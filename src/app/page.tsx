'use client'

import Link from 'next/link'
import { PlusCircle, TrendingUp, Calendar, CreditCard, User, LogOut } from 'lucide-react'
import { PlusCircle, TrendingUp, Calendar, CreditCard, User, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { expenses, categories } = useStore()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!session) return null
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Cheqa</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/expenses" className="text-gray-700 hover:text-gray-900">
                Expenses
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-700 hover:text-gray-900">
                Payment Methods
              </Link>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {session.user?.name?.split(' ')[0] || 'User'}!</h2>
            <p className="text-gray-600">Here's your expense overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Expenses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(totalExpenses)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        This Month
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(monthlyExpenses)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Categories
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {categories.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <Link
                  href="/expenses/create"
                  className="flex items-center justify-center w-full h-full text-blue-600 hover:text-blue-800"
                >
                  <PlusCircle className="h-8 w-8" />
                  <span className="ml-2 font-medium">Add Expense</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SpendingChart expenses={expenses} categories={categories} />
              <MonthlyTrend expenses={expenses} />
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
                      const category = categories.find(c => c.id === expense.categoryId)
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
                      )
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
  )
}