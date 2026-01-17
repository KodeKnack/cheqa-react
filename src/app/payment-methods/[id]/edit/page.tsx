'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Save, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import ThemeToggle from '@/components/ThemeToggle'

export default function EditPaymentMethod() {
  const router = useRouter()
  const params = useParams()
  const { paymentMethods, updatePaymentMethod, loadData } = useStore()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (paymentMethods.length > 0 && params.id) {
      const method = paymentMethods.find(m => m.id === params.id)
      if (method) {
        setName(method.name)
        setLoading(false)
      }
    }
  }, [paymentMethods, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (params.id) {
      await updatePaymentMethod(params.id as string, { name })
      router.push('/payment-methods')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Edit Payment Method
              </h3>
              <ThemeToggle />
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Payment Method Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:opacity-90 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <Link
                    href="/payment-methods"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950 w-full sm:w-auto"
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
  )
}
