'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Edit, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import ThemeToggle from '@/components/ThemeToggle'

export default function EditExpense() {
  const router = useRouter()
  const params = useParams()
  const { expenses, categories, paymentMethods, updateExpense, loadData } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    paymentMethodId: '',
    expenseDate: ''
  })

  const expense = expenses.find(e => e.id === params.id)
  
  useEffect(() => {
    // Load data if not already loaded
    if (categories.length === 0 || paymentMethods.length === 0) {
      loadData()
    }
  }, [])

  useEffect(() => {
    if (expense) {
      // Convert date to YYYY-MM-DD format for HTML date input
      let dateValue = expense.expenseDate
      if (typeof dateValue === 'string') {
        dateValue = dateValue.includes('T') 
          ? dateValue.split('T')[0] 
          : dateValue
      } else {
        dateValue = new Date(dateValue).toISOString().split('T')[0]
      }
      
      setFormData({
        description: expense.description || '',
        amount: expense.amount ? expense.amount.toString() : '',
        categoryId: expense.categoryId || '',
        paymentMethodId: expense.paymentMethodId || '',
        expenseDate: dateValue
      })
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (expense && !loading) {
      setLoading(true)
      try {
        await updateExpense(expense.id, {
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          categoryId: formData.categoryId,
          paymentMethodId: formData.paymentMethodId,
          expenseDate: formData.expenseDate
        })
        router.push('/expenses')
      } catch (error) {
        console.error('Update failed:', error)
        alert('Failed to update expense')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!expense) {
    return <div>Expense not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cheqa</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/expenses" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Expenses
              </Link>
              <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Payment Methods
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Edit Expense
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-600 dark:text-gray-400 sm:text-sm">R</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Category
                    </label>
                      <select
                        name="categoryId"
                        id="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                    <label htmlFor="paymentMethodId" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Payment Method
                    </label>
                      <select
                        name="paymentMethodId"
                        id="paymentMethodId"
                        required
                        value={formData.paymentMethodId}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </label>
                    <input
                      type="date"
                      name="expenseDate"
                      id="expenseDate"
                      required
                      value={formData.expenseDate}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {loading ? 'Updating...' : 'Update Expense'}
                    </button>
                    <Link
                      href="/expenses"
                      className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
