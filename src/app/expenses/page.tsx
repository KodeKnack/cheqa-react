'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Search, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import DateRangePicker from '@/components/DateRangePicker'
import ExportButton from '@/components/ExportButton'

export default function Expenses() {
  const { expenses, categories, paymentMethods, deleteExpense } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown'
  const getPaymentMethodName = (id: string) => paymentMethods.find(p => p.id === id)?.name || 'Unknown'

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const expenseDate = new Date(expense.expenseDate)
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = expenseDate >= startDate && expenseDate <= endDate
    }
    
    return matchesSearch && matchesDateRange
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount).replace('ZAR', 'R')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">Cheqa</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/expenses" className="text-blue-600 font-medium">
                Expenses
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-700 hover:text-gray-900">
                Payment Methods
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Expenses</h2>
            <div className="flex space-x-3">
              <ExportButton />
              <Link
                href="/expenses/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Link>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DateRangePicker 
                    onDateRangeChange={(start, end) => setDateRange({ start, end })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <li className="px-4 py-12 text-center">
                  <div className="text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No expenses found</p>
                    <p className="mt-1">Get started by adding your first expense.</p>
                    <Link
                      href="/expenses/create"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Expense
                    </Link>
                  </div>
                </li>
              ) : (
                expenses.map((expense) => (
                  <li key={expense.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getCategoryName(expense.categoryId)} • {getPaymentMethodName(expense.paymentMethodId)} • {formatDate(expense.expenseDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/expenses/${expense.id}/edit`} className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}