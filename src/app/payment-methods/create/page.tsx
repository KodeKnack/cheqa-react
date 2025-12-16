'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusCircle, X } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function CreatePaymentMethod() {
  const router = useRouter()
  const { addPaymentMethod } = useStore()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addPaymentMethod({ name })
    router.push('/payment-methods')
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
              <Link href="/expenses" className="text-gray-700 hover:text-gray-900">
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

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Payment Method
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Payment Method Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                      placeholder="Enter payment method name"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Save Payment Method
                    </button>
                    <Link
                      href="/payment-methods"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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