'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Tag, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import ThemeToggle from '@/components/ThemeToggle'

export default function Categories() {
  const { categories, expenses, deleteCategory, loadData } = useStore()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const getCategoryExpenseCount = (categoryId: string) => {
    return expenses.filter(expense => expense.categoryId === categoryId).length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Cheqa</Link>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/expenses" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Expenses
              </Link>
              <Link href="/categories" className="text-blue-600 dark:text-blue-400 font-medium">
                Categories
              </Link>
              <Link href="/payment-methods" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100">
                Payment Methods
              </Link>
              <ThemeToggle />
            </div>
            <div className="sm:hidden flex items-center">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:opacity-90">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:opacity-90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Categories</h2>
            <Link
              href="/categories/create"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:opacity-90 w-full sm:w-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <li key={category.id}>
                  <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getCategoryExpenseCount(category.id)} expenses
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-14 sm:ml-0">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:opacity-90 text-sm px-3 py-1 rounded border border-gray-200 dark:border-gray-700"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 dark:text-red-400 hover:opacity-90 text-sm px-3 py-1 rounded border border-gray-200 dark:border-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
