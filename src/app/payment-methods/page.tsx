'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, CreditCard, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function PaymentMethods() {
  const { paymentMethods, expenses, deletePaymentMethod, loadData } = useStore()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const getPaymentMethodExpenseCount = (methodId: string) => {
    return expenses.filter(expense => expense.paymentMethodId === methodId).length
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
              <Link href="/payment-methods" className="text-blue-600 font-medium">
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
            <h2 className="text-3xl font-bold text-gray-900">Payment Methods</h2>
            <Link
              href="/payment-methods/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment Method
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <li key={method.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPaymentMethodExpenseCount(method.id)} expenses
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
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