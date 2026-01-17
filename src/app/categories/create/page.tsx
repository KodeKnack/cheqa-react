'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusCircle, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import ThemeToggle from '@/components/ThemeToggle'

export default function CreateCategory() {
  const router = useRouter()
  const { addCategory } = useStore()
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCategory({ name })
    router.push('/categories')
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
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Category
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Save Category
                    </button>
                    <Link
                      href="/categories"
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
